const VideoPreview = () => {
  return (
    <>
      <div className="border border-white/30 p-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-amber-400">LIVE PREVIEW <span className="text-xs text-amber-400/60">ライブプレビュー</span></p>
          <div className="border border-white/30 bg-white w-lg h-120"></div>
        </div>
      </div>
    </>
  );
};
export default VideoPreview;
