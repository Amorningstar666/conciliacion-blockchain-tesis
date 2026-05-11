import React from "react";
import { ethers } from "ethers";
import { HARDHAT_PRIVATE_KEYS } from "../../services/hardhatAccounts";
import Spinner from "../../components/ui/Spinner";
import { LoginHeader } from "./components/LoginHeader";
import { RolCard } from "./components/RolCard";
import { ROLES_FIJOS } from "./constants/roles";

function addrFromPk(pkIdx) {
  try {
    return new ethers.Wallet(HARDHAT_PRIVATE_KEYS[pkIdx]).address;
  } catch {
    return `Cuenta #${pkIdx}`;
  }
}

export default function LoginScreen({ onLogin, connecting }) {
  const handleLogin = (r) => {
    const privateKey = HARDHAT_PRIVATE_KEYS[r.pkIdx];
    onLogin({ role: r.role, privateKey, idx: r.pkIdx });
  };

  const rolesConAddress = ROLES_FIJOS.map((r) => ({
    ...r,
    address: addrFromPk(r.pkIdx),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex flex-col items-center justify-center p-8">
      <LoginHeader />

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {rolesConAddress.map((rol) => (
          <RolCard key={rol.role} rol={rol} onSelect={() => handleLogin(rol)} connecting={connecting} />
        ))}
      </div>

      {connecting && (
        <div className="mt-8 flex items-center gap-3 text-blue-300">
          <Spinner />
          <span className="text-sm">Conectando a Hardhat...</span>
        </div>
      )}
    </div>
  );
}
