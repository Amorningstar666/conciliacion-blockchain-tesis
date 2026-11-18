// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IConciliacionLaboral {
    function retirarFondos(bytes32 _hashActa) external;
}

/**
 * @title TrabajadorReentrante
 * @dev Contrato de prueba. Actua como "trabajador" de un acuerdo e intenta
 * retirar por segunda vez mientras recibe el primer pago (ataque de reentrancia).
 * Solo se usa en test/; no se despliega con el sistema.
 */
contract TrabajadorReentrante {
    IConciliacionLaboral public immutable objetivo;
    bytes32 public hashActa;
    uint256 public intentosDeReentrada;
    bool public reentradaExitosa;

    constructor(address _objetivo) {
        objetivo = IConciliacionLaboral(_objetivo);
    }

    function atacar(bytes32 _hashActa) external {
        hashActa = _hashActa;
        objetivo.retirarFondos(_hashActa);
    }

    receive() external payable {
        if (intentosDeReentrada == 0) {
            intentosDeReentrada = 1;
            try objetivo.retirarFondos(hashActa) {
                reentradaExitosa = true;
            } catch {
                // El contrato rechazo el segundo retiro: comportamiento esperado.
            }
        }
    }
}
