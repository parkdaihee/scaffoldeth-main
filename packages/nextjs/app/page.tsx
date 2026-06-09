"use client";

import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const { data: counterValue, isLoading: isCounterLoading } = useScaffoldReadContract({
    contractName: "Counter",
    functionName: "getCounter",
  });

  const { data: ownerAddress } = useScaffoldReadContract({
    contractName: "Counter",
    functionName: "owner",
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "Counter",
  });

  const { data: counterContract } = useDeployedContractInfo({ contractName: "Counter" });

  const handleWrite = async (fn: "incrementCounter" | "decrementCounter" | "resetCounter") => {
    try {
      await writeContractAsync({ functionName: fn });
      notification.success("트랜잭션이 전송되었습니다.");
    } catch (e) {
      notification.error(getParsedError(e));
    }
  };

  return (
    <>
      <div className="flex items-center flex-col grow pt-10 px-4">
        <div className="w-full max-w-xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold leading-tight">카운터</h1>
                  <div className="text-sm text-base-content/60">
                    {targetNetwork.name} (Chain ID: {targetNetwork.id})
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  className="btn btn-primary btn-lg min-w-24 text-3xl font-bold"
                  onClick={() => handleWrite("decrementCounter")}
                  disabled={isMining}
                >
                  –
                </button>

                <div className="card bg-base-200 shadow-inner px-8 py-6 min-w-40 text-center">
                  <div className="text-sm text-base-content/60 mb-1">현재값</div>
                  <div className="text-6xl font-black tabular-nums">
                    {isCounterLoading ? "…" : String(counterValue ?? 0n)}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg min-w-24 text-3xl font-bold"
                  onClick={() => handleWrite("incrementCounter")}
                  disabled={isMining}
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-base-content/60">Connected</div>
                  <Address address={connectedAddress} chain={targetNetwork} />
                </div>
                <button className="btn btn-outline" onClick={() => handleWrite("resetCounter")} disabled={isMining}>
                  Reset (Owner)
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs text-base-content/60">Owner</div>
                <Address address={ownerAddress} chain={targetNetwork} />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs text-base-content/60">Contract</div>
                <Address address={counterContract?.address} chain={targetNetwork} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
