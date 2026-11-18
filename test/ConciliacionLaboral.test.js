const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Pruebas de ConciliacionLaboralColombia (contracts/ConciliacionLaboral.sol).
// Cada grupo corresponde a una funcion del contrato. El ultimo grupo no prueba
// aciertos: deja constancia de lo que el contrato NO hace, para que el texto
// de la tesis y el README no afirmen mas de lo que el codigo garantiza.

const MONTO = ethers.parseEther("2");
const DIAS = 30n;
const HASH = ethers.id("ACTA-PGN-001");
const HASH_INEXISTENTE = ethers.id("ACTA-QUE-NO-EXISTE");

async function desplegar() {
  const [admin, autoridad, empleador, trabajador, conciliador, otroConciliador, extrano] =
    await ethers.getSigners();
  const Factory = await ethers.getContractFactory("ConciliacionLaboralColombia");
  const contrato = await Factory.deploy(autoridad.address);
  await contrato.connect(admin).registrarConciliador(conciliador.address);
  await contrato.connect(admin).registrarConciliador(otroConciliador.address);
  return { contrato, admin, autoridad, empleador, trabajador, conciliador, otroConciliador, extrano };
}

function crear(ctx, opciones = {}) {
  const {
    hash = HASH,
    desde = ctx.empleador,
    trabajador = ctx.trabajador.address,
    conciliador = ctx.conciliador.address,
    dias = DIAS,
    modalidad = "unico",
    cuotas = 1,
    valor = MONTO,
  } = opciones;
  return ctx.contrato
    .connect(desde)
    .crearAcuerdo(hash, trabajador, conciliador, "Bogota D.C.", dias, modalidad, cuotas, { value: valor });
}

async function conAcuerdoDepositado() {
  const ctx = await desplegar();
  await crear(ctx);
  return ctx;
}

async function conAcuerdoValidado() {
  const ctx = await conAcuerdoDepositado();
  await ctx.contrato.connect(ctx.conciliador).validarActa(HASH);
  return ctx;
}

describe("ConciliacionLaboralColombia", function () {
  describe("Despliegue", function () {
    it("asigna como administrador a quien despliega", async function () {
      const { contrato, admin } = await loadFixture(desplegar);
      expect(await contrato.administrador()).to.equal(admin.address);
    });

    it("guarda la autoridad judicial recibida en el constructor", async function () {
      const { contrato, autoridad } = await loadFixture(desplegar);
      expect(await contrato.autoridadJudicial()).to.equal(autoridad.address);
    });

    it("rechaza una autoridad judicial con direccion cero", async function () {
      const Factory = await ethers.getContractFactory("ConciliacionLaboralColombia");
      await expect(Factory.deploy(ethers.ZeroAddress)).to.be.revertedWith("Autoridad judicial invalida");
    });
  });

  describe("Catalogo de conciliadores", function () {
    it("el administrador registra un conciliador y se emite el evento", async function () {
      const { contrato, admin, extrano } = await loadFixture(desplegar);
      await expect(contrato.connect(admin).registrarConciliador(extrano.address))
        .to.emit(contrato, "ConciliadorRegistrado")
        .withArgs(extrano.address);
      expect(await contrato.conciliadoresAutorizados(extrano.address)).to.equal(true);
    });

    it("una cuenta que no es el administrador no puede registrar", async function () {
      const { contrato, extrano } = await loadFixture(desplegar);
      await expect(contrato.connect(extrano).registrarConciliador(extrano.address)).to.be.revertedWith(
        "Solo el Director puede ejecutar esto"
      );
    });

    it("rechaza registrar la direccion cero", async function () {
      const { contrato, admin } = await loadFixture(desplegar);
      await expect(contrato.connect(admin).registrarConciliador(ethers.ZeroAddress)).to.be.revertedWith(
        "Direccion invalida"
      );
    });

    it("rechaza registrar dos veces al mismo conciliador", async function () {
      const { contrato, admin, conciliador } = await loadFixture(desplegar);
      await expect(contrato.connect(admin).registrarConciliador(conciliador.address)).to.be.revertedWith(
        "Conciliador ya registrado"
      );
    });

    it("el administrador revoca un conciliador y se emite el evento", async function () {
      const { contrato, admin, conciliador } = await loadFixture(desplegar);
      await expect(contrato.connect(admin).revocarConciliador(conciliador.address))
        .to.emit(contrato, "ConciliadorRevocado")
        .withArgs(conciliador.address);
      expect(await contrato.conciliadoresAutorizados(conciliador.address)).to.equal(false);
    });

    it("una cuenta que no es el administrador no puede revocar", async function () {
      const { contrato, conciliador, extrano } = await loadFixture(desplegar);
      await expect(contrato.connect(extrano).revocarConciliador(conciliador.address)).to.be.revertedWith(
        "Solo el Director puede ejecutar esto"
      );
    });

    it("rechaza revocar a quien no esta registrado", async function () {
      const { contrato, admin, extrano } = await loadFixture(desplegar);
      await expect(contrato.connect(admin).revocarConciliador(extrano.address)).to.be.revertedWith(
        "Conciliador no registrado"
      );
    });
  });

  describe("crearAcuerdo (deposito del empleador)", function () {
    it("registra las partes, el monto y deja el acuerdo como depositado", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      const a = await ctx.contrato.getAcuerdo(HASH);
      expect(a.empleador).to.equal(ctx.empleador.address);
      expect(a.trabajador).to.equal(ctx.trabajador.address);
      expect(a.conciliador).to.equal(ctx.conciliador.address);
      expect(a.monto).to.equal(MONTO);
      expect(a.lugarConciliacion).to.equal("Bogota D.C.");
      expect(a.depositado).to.equal(true);
      expect(a.validadoPorConciliador).to.equal(false);
      expect(a.pagado).to.equal(false);
      expect(a.suspendidoJudicialmente).to.equal(false);
    });

    it("el dinero sale del empleador y queda en custodia del contrato", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(crear(ctx)).to.changeEtherBalances([ctx.empleador, ctx.contrato], [-MONTO, MONTO]);
    });

    it("emite AcuerdoCreado con el hash y las tres direcciones", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(crear(ctx))
        .to.emit(ctx.contrato, "AcuerdoCreado")
        .withArgs(HASH, ctx.empleador.address, ctx.trabajador.address, ctx.conciliador.address);
    });

    it("calcula el plazo como fecha de creacion mas los dias pactados", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      const a = await ctx.contrato.getAcuerdo(HASH);
      expect(a.fechaCreacion).to.equal(await time.latest());
      expect(a.plazoCumplimiento).to.equal(a.fechaCreacion + DIAS * 86400n);
    });

    it("rechaza un acuerdo sin dinero", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(crear(ctx, { valor: 0n })).to.be.revertedWith("Debe incluir el monto del acuerdo");
    });

    it("rechaza un plazo de cero dias", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(crear(ctx, { dias: 0n })).to.be.revertedWith("El plazo debe ser mayor a cero");
    });

    it("rechaza un trabajador con direccion cero", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(crear(ctx, { trabajador: ethers.ZeroAddress })).to.be.revertedWith(
        "Direccion del trabajador invalida"
      );
    });

    it("rechaza designar a un conciliador que no esta en el catalogo", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(crear(ctx, { conciliador: ctx.extrano.address })).to.be.revertedWith(
        "El conciliador no esta autorizado por la PGN"
      );
    });

    it("rechaza designar a un conciliador revocado", async function () {
      const ctx = await loadFixture(desplegar);
      await ctx.contrato.connect(ctx.admin).revocarConciliador(ctx.conciliador.address);
      await expect(crear(ctx)).to.be.revertedWith("El conciliador no esta autorizado por la PGN");
    });

    it("rechaza registrar dos veces la misma acta", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await expect(crear(ctx)).to.be.revertedWith("Acta ya registrada");
    });
  });

  describe("validarActa (control de legalidad del conciliador)", function () {
    it("el conciliador asignado valida, se marcan las dos banderas y se emite el evento", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await expect(ctx.contrato.connect(ctx.conciliador).validarActa(HASH))
        .to.emit(ctx.contrato, "ActaValidada")
        .withArgs(HASH, ctx.conciliador.address);
      const a = await ctx.contrato.getAcuerdo(HASH);
      expect(a.validadoPorConciliador).to.equal(true);
      expect(a.derechosConciliablesVerificados).to.equal(true);
    });

    it("otro conciliador autorizado, distinto del asignado, no puede validar", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await expect(ctx.contrato.connect(ctx.otroConciliador).validarActa(HASH)).to.be.revertedWith(
        "Solo el conciliador asignado valida"
      );
    });

    it("ni el empleador ni el trabajador pueden validar su propio acuerdo", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      for (const parte of [ctx.empleador, ctx.trabajador]) {
        await expect(ctx.contrato.connect(parte).validarActa(HASH)).to.be.revertedWith(
          "Solo el conciliador asignado valida"
        );
      }
    });

    it("rechaza validar un acta que no existe", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(ctx.contrato.connect(ctx.conciliador).validarActa(HASH_INEXISTENTE)).to.be.revertedWith(
        "El acta no existe"
      );
    });

    it("rechaza validar un acuerdo suspendido judicialmente", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH);
      await expect(ctx.contrato.connect(ctx.conciliador).validarActa(HASH)).to.be.revertedWith(
        "Acuerdo suspendido judicialmente"
      );
    });
  });

  describe("retirarFondos (pago al trabajador)", function () {
    it("transfiere al trabajador exactamente el monto depositado", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.changeEtherBalances(
        [ctx.contrato, ctx.trabajador],
        [-MONTO, MONTO]
      );
      expect((await ctx.contrato.getAcuerdo(HASH)).pagado).to.equal(true);
    });

    it("emite PagoEjecutado con el trabajador y el monto", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH))
        .to.emit(ctx.contrato, "PagoEjecutado")
        .withArgs(HASH, ctx.trabajador.address, MONTO);
    });

    it("nadie distinto del trabajador puede retirar", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      for (const cuenta of [ctx.empleador, ctx.conciliador, ctx.admin, ctx.extrano]) {
        await expect(ctx.contrato.connect(cuenta).retirarFondos(HASH)).to.be.revertedWith(
          "Solo el trabajador retira"
        );
      }
    });

    it("rechaza el retiro si el conciliador no ha validado", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.be.revertedWith(
        "Acta no validada legalmente"
      );
    });

    it("rechaza un segundo retiro del mismo acuerdo", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      await ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.be.revertedWith("Ya se pago");
    });

    it("rechaza retirar de un acta que no existe", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH_INEXISTENTE)).to.be.revertedWith(
        "El acta no existe"
      );
    });

    it("el retiro de un acuerdo no toca el dinero de otro acuerdo", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      const otroHash = ethers.id("ACTA-PGN-002");
      const otroMonto = ethers.parseEther("5");
      await crear(ctx, { hash: otroHash, valor: otroMonto });
      await ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH);
      expect(await ethers.provider.getBalance(ctx.contrato.target)).to.equal(otroMonto);
    });

    it("resiste un ataque de reentrancia: el trabajador cobra una sola vez", async function () {
      const ctx = await loadFixture(desplegar);
      const Atacante = await ethers.getContractFactory("TrabajadorReentrante");
      const atacante = await Atacante.deploy(ctx.contrato.target);
      // Un segundo acuerdo deja en el contrato dinero ajeno que el ataque intentaria llevarse.
      await crear(ctx, { hash: ethers.id("ACTA-AJENA"), valor: MONTO });
      await crear(ctx, { trabajador: atacante.target });
      await ctx.contrato.connect(ctx.conciliador).validarActa(HASH);

      await expect(atacante.atacar(HASH)).to.changeEtherBalances([ctx.contrato, atacante], [-MONTO, MONTO]);
      expect(await atacante.intentosDeReentrada()).to.equal(1n);
      expect(await atacante.reentradaExitosa()).to.equal(false);
    });
  });

  describe("suspenderJudicialmente (control judicial)", function () {
    it("la autoridad judicial suspende y se emite el evento", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await expect(ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH))
        .to.emit(ctx.contrato, "AcuerdoSuspendido")
        .withArgs(HASH, ctx.autoridad.address);
      expect((await ctx.contrato.getAcuerdo(HASH)).suspendidoJudicialmente).to.equal(true);
    });

    it("ni el administrador, ni el conciliador, ni las partes pueden suspender", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      for (const cuenta of [ctx.admin, ctx.conciliador, ctx.empleador, ctx.trabajador]) {
        await expect(ctx.contrato.connect(cuenta).suspenderJudicialmente(HASH)).to.be.revertedWith(
          "Solo la autoridad judicial puede ejecutar esto"
        );
      }
    });

    it("rechaza suspender un acta que no existe", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(
        ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH_INEXISTENTE)
      ).to.be.revertedWith("El acta no existe");
    });

    it("rechaza suspender un acuerdo que ya fue pagado", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      await ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH);
      await expect(ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH)).to.be.revertedWith(
        "El acuerdo ya fue pagado"
      );
    });

    it("rechaza suspender dos veces", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH);
      await expect(ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH)).to.be.revertedWith(
        "Ya esta suspendido"
      );
    });

    it("una suspension posterior a la validacion bloquea el retiro", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      await ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.be.revertedWith(
        "Acuerdo suspendido judicialmente"
      );
    });
  });

  describe("getAcuerdo (lectura)", function () {
    it("rechaza consultar un acta que no existe", async function () {
      const { contrato } = await loadFixture(desplegar);
      await expect(contrato.getAcuerdo(HASH_INEXISTENTE)).to.be.revertedWith("El acta no existe");
    });
  });

  // Estas pruebas pasan porque describen lo que el contrato hace hoy, no lo que
  // deberia hacer. Si el contrato se corrige, cada una debe invertirse.
  describe("Limitaciones conocidas del contrato (comportamiento actual)", function () {
    it("el plazo se registra pero no se exige: validada el acta, se retira el mismo dia", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      const a = await ctx.contrato.getAcuerdo(HASH);
      expect(a.plazoCumplimiento).to.be.greaterThan(await time.latest());
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.changeEtherBalance(
        ctx.trabajador,
        MONTO
      );
    });

    it("el plazo tampoco caduca: se puede retirar mucho despues de vencido", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      await time.increase(365 * 86400);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.changeEtherBalance(
        ctx.trabajador,
        MONTO
      );
    });

    it("el pago por cuotas se registra pero se libera completo en un solo retiro", async function () {
      const ctx = await loadFixture(desplegar);
      await crear(ctx, { modalidad: "cuotas", cuotas: 3 });
      await ctx.contrato.connect(ctx.conciliador).validarActa(HASH);
      const a = await ctx.contrato.getAcuerdo(HASH);
      expect(a.modalidadPago).to.equal("cuotas");
      expect(a.numeroCuotas).to.equal(3n);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.changeEtherBalance(
        ctx.trabajador,
        MONTO
      );
    });

    it("no existe funcion para reactivar un acuerdo suspendido ni para devolver el deposito", async function () {
      const { contrato } = await loadFixture(desplegar);
      const funciones = contrato.interface.fragments.filter((f) => f.type === "function").map((f) => f.name);
      expect(funciones).to.have.members([
        "acuerdos",
        "administrador",
        "autoridadJudicial",
        "conciliadoresAutorizados",
        "crearAcuerdo",
        "getAcuerdo",
        "registrarConciliador",
        "retirarFondos",
        "revocarConciliador",
        "suspenderJudicialmente",
        "validarActa",
      ]);
    });

    it("los fondos de un acuerdo suspendido quedan bloqueados en el contrato", async function () {
      const ctx = await loadFixture(conAcuerdoValidado);
      await ctx.contrato.connect(ctx.autoridad).suspenderJudicialmente(HASH);
      await time.increase(365 * 86400);
      await expect(ctx.contrato.connect(ctx.trabajador).retirarFondos(HASH)).to.be.reverted;
      expect(await ethers.provider.getBalance(ctx.contrato.target)).to.equal(MONTO);
    });

    it("si el conciliador nunca valida, el empleador no puede recuperar el deposito", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await time.increase(365 * 86400);
      await expect(ctx.contrato.connect(ctx.empleador).retirarFondos(HASH)).to.be.revertedWith(
        "Solo el trabajador retira"
      );
      expect(await ethers.provider.getBalance(ctx.contrato.target)).to.equal(MONTO);
    });

    it("cualquier cuenta puede crear un acuerdo; no se exige ser conciliador", async function () {
      const ctx = await loadFixture(desplegar);
      expect(await ctx.contrato.conciliadoresAutorizados(ctx.extrano.address)).to.equal(false);
      await expect(crear(ctx, { desde: ctx.extrano })).to.emit(ctx.contrato, "AcuerdoCreado");
    });

    it("un conciliador revocado despues del deposito todavia puede validar el acta asignada", async function () {
      const ctx = await loadFixture(conAcuerdoDepositado);
      await ctx.contrato.connect(ctx.admin).revocarConciliador(ctx.conciliador.address);
      await expect(ctx.contrato.connect(ctx.conciliador).validarActa(HASH)).to.emit(
        ctx.contrato,
        "ActaValidada"
      );
    });

    it("el numero de cuotas no se valida: acepta cero cuotas y modalidades arbitrarias", async function () {
      const ctx = await loadFixture(desplegar);
      await expect(crear(ctx, { modalidad: "cualquier texto", cuotas: 0 })).to.emit(
        ctx.contrato,
        "AcuerdoCreado"
      );
    });
  });
});
