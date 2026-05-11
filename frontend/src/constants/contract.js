// La dirección se genera automáticamente al correr 'npm run setup'.
// No hardcodear aquí — leer desde deployment.json.
import deployment from "./deployment.json";

export const CONTRACT_ADDRESS = deployment.contractAddress;
export { deployment };

export const CONTRACT_ABI = [
  "function administrador() external view returns (address)",
  "function autoridadJudicial() external view returns (address)",
  "function conciliadoresAutorizados(address) external view returns (bool)",
  "function registrarConciliador(address _conciliador) external",
  "function revocarConciliador(address _conciliador) external",
  "function crearAcuerdo(bytes32 _hashActa, address _trabajador, address _conciliador, string _lugar, uint256 _dias, string _modalidadPago, uint256 _numeroCuotas) external payable",
  "function validarActa(bytes32 _hashActa) external",
  "function retirarFondos(bytes32 _hashActa) external",
  "function suspenderJudicialmente(bytes32 _hashActa) external",
  "function getAcuerdo(bytes32 _hashActa) external view returns (address empleador, address trabajador, address conciliador, uint256 monto, uint256 fechaCreacion, string lugarConciliacion, uint256 plazoCumplimiento, string modalidadPago, uint256 numeroCuotas, bool depositado, bool validadoPorConciliador, bool pagado, bool suspendidoJudicialmente, bool derechosConciliablesVerificados)",
  "event AcuerdoCreado(bytes32 indexed hashActa, address indexed empleador, address indexed trabajador, address conciliador)",
  "event ActaValidada(bytes32 indexed hashActa, address indexed conciliador)",
  "event PagoEjecutado(bytes32 indexed hashActa, address indexed trabajador, uint256 monto)",
  "event ConciliadorRegistrado(address indexed conciliador)",
  "event ConciliadorRevocado(address indexed conciliador)",
];
