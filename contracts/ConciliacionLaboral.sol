// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ConciliacionLaboralColombia_Ley2220
 * @dev Basado en el Estatuto de Conciliación (Ley 2220 de 2022)
 */
contract ConciliacionLaboralColombia {

    struct Acuerdo {
        bytes32 hashActa;
        address empleador;
        address trabajador;
        address conciliador;
        uint256 monto;
        uint256 fechaCreacion;
        string lugarConciliacion;
        uint256 plazoCumplimiento;
        string modalidadPago;       // "unico" | "cuotas" — viene del frontend
        uint256 numeroCuotas;       // 1 si modalidad es "unico"
        bool depositado;
        bool validadoPorConciliador;
        bool pagado;
        bool suspendidoJudicialmente;
        bool derechosConciliablesVerificados;
    }

    mapping(bytes32 => Acuerdo) public acuerdos;
    mapping(address => bool) public conciliadoresAutorizados;
    address public autoridadJudicial;
    address public administrador;

    event AcuerdoCreado(bytes32 indexed hashActa, address indexed empleador, address indexed trabajador, address conciliador);
    event ActaValidada(bytes32 indexed hashActa, address indexed conciliador);
    event PagoEjecutado(bytes32 indexed hashActa, address indexed trabajador, uint256 monto);
    event ConciliadorRegistrado(address indexed conciliador);
    event ConciliadorRevocado(address indexed conciliador);
    event AcuerdoSuspendido(bytes32 indexed hashActa, address indexed autoridadJudicial);

    modifier soloConciliadorAutorizado() {
        require(conciliadoresAutorizados[msg.sender], "No tiene calidad de conciliador PGN");
        _;
    }

    modifier soloAdministrador() {
        require(msg.sender == administrador, "Solo el Director puede ejecutar esto");
        _;
    }

    modifier soloAutoridadJudicial() {
        require(msg.sender == autoridadJudicial, "Solo la autoridad judicial puede ejecutar esto");
        _;
    }

    modifier acuerdoExiste(bytes32 _hashActa) {
        require(acuerdos[_hashActa].empleador != address(0), "El acta no existe");
        _;
    }

    constructor(address _autoridadJudicial) {
        require(_autoridadJudicial != address(0), "Autoridad judicial invalida");
        administrador = msg.sender;
        autoridadJudicial = _autoridadJudicial;
    }

    function registrarConciliador(address _conciliador) external soloAdministrador {
        require(_conciliador != address(0), "Direccion invalida");
        require(!conciliadoresAutorizados[_conciliador], "Conciliador ya registrado");
        conciliadoresAutorizados[_conciliador] = true;
        emit ConciliadorRegistrado(_conciliador);
    }

    function revocarConciliador(address _conciliador) external soloAdministrador {
        require(conciliadoresAutorizados[_conciliador], "Conciliador no registrado");
        conciliadoresAutorizados[_conciliador] = false;
        emit ConciliadorRevocado(_conciliador);
    }

    function crearAcuerdo(
        bytes32 _hashActa,
        address _trabajador,
        address _conciliador,
        string memory _lugar,
        uint256 _dias,
        string memory _modalidadPago,
        uint256 _numeroCuotas
    ) external payable {
        require(msg.value > 0, "Debe incluir el monto del acuerdo");
        require(_dias > 0, "El plazo debe ser mayor a cero");
        require(_trabajador != address(0), "Direccion del trabajador invalida");
        require(conciliadoresAutorizados[_conciliador], "El conciliador no esta autorizado por la PGN");
        require(acuerdos[_hashActa].empleador == address(0), "Acta ya registrada");

        Acuerdo storage a = acuerdos[_hashActa];
        a.hashActa = _hashActa;
        a.empleador = msg.sender;
        a.trabajador = _trabajador;
        a.conciliador = _conciliador;
        a.monto = msg.value;
        a.fechaCreacion = block.timestamp;
        a.lugarConciliacion = _lugar;
        a.plazoCumplimiento = block.timestamp + (_dias * 1 days);
        a.modalidadPago = _modalidadPago;
        a.numeroCuotas = _numeroCuotas;
        a.depositado = true;

        emit AcuerdoCreado(_hashActa, msg.sender, _trabajador, _conciliador);
    }

    function validarActa(bytes32 _hashActa) external acuerdoExiste(_hashActa) {
        Acuerdo storage a = acuerdos[_hashActa];
        require(msg.sender == a.conciliador, "Solo el conciliador asignado valida");
        require(!a.suspendidoJudicialmente, "Acuerdo suspendido judicialmente");

        a.validadoPorConciliador = true;
        a.derechosConciliablesVerificados = true;
        emit ActaValidada(_hashActa, msg.sender);
    }

    function suspenderJudicialmente(bytes32 _hashActa) external soloAutoridadJudicial acuerdoExiste(_hashActa) {
        Acuerdo storage a = acuerdos[_hashActa];
        require(!a.pagado, "El acuerdo ya fue pagado");
        require(!a.suspendidoJudicialmente, "Ya esta suspendido");
        a.suspendidoJudicialmente = true;
        emit AcuerdoSuspendido(_hashActa, msg.sender);
    }

    function retirarFondos(bytes32 _hashActa) external acuerdoExiste(_hashActa) {
        Acuerdo storage a = acuerdos[_hashActa];
        require(msg.sender == a.trabajador, "Solo el trabajador retira");
        require(a.validadoPorConciliador, "Acta no validada legalmente");
        require(!a.pagado, "Ya se pago");
        require(!a.suspendidoJudicialmente, "Acuerdo suspendido judicialmente");

        a.pagado = true;
        (bool success, ) = payable(a.trabajador).call{value: a.monto}("");
        require(success, "Fallo transferencia");

        emit PagoEjecutado(_hashActa, a.trabajador, a.monto);
    }

    /**
     * @dev Retorna todos los campos del acuerdo en una sola llamada.
     * Facilita la lectura desde el frontend sin tener que decodificar tuplas genéricas.
     */
    function getAcuerdo(bytes32 _hashActa) external view acuerdoExiste(_hashActa) returns (
        address empleador,
        address trabajador,
        address conciliador,
        uint256 monto,
        uint256 fechaCreacion,
        string memory lugarConciliacion,
        uint256 plazoCumplimiento,
        string memory modalidadPago,
        uint256 numeroCuotas,
        bool depositado,
        bool validadoPorConciliador,
        bool pagado,
        bool suspendidoJudicialmente,
        bool derechosConciliablesVerificados
    ) {
        Acuerdo storage a = acuerdos[_hashActa];
        return (
            a.empleador,
            a.trabajador,
            a.conciliador,
            a.monto,
            a.fechaCreacion,
            a.lugarConciliacion,
            a.plazoCumplimiento,
            a.modalidadPago,
            a.numeroCuotas,
            a.depositado,
            a.validadoPorConciliador,
            a.pagado,
            a.suspendidoJudicialmente,
            a.derechosConciliablesVerificados
        );
    }
}