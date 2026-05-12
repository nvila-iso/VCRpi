const TransferProgress = ({ systemStatus, transferProgress = 0 }) => {
  const isTransferring = systemStatus === "TRANSFERRING";

  return (
    <div className="flex-1 border border-white/30 bg-black/30 p-3 text-amber-400">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-amber-400/60">TRANSFER PROGRESS</p>
          <p
            className={`text-xl font-bold ${
              isTransferring ? "text-blue-300" : "text-amber-400/40"
            }`}
          >
            {isTransferring ? "TRANSFERRING" : "NO ACTIVE TRANSFER"}
          </p>
        </div>

        <p className="text-2xl font-mono">
          {isTransferring ? `${transferProgress}%` : "--"}
        </p>
      </div>

      <div className="mt-3 h-3 border border-white/30 bg-black/40 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isTransferring ? "bg-blue-300" : "bg-white/10"
          }`}
          style={{
            width: isTransferring ? `${transferProgress}%` : "0%",
          }}
        />
      </div>
    </div>
  );
};

export default TransferProgress;
