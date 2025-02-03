const VideoSection = () => {
  return (
    <div className="w-full rounded-xl bg-muted p-4 mt-6">
      <div className="aspect-video w-full bg-secondary/20 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Video content here</span>
      </div>
      <div className="flex justify-between mt-4 text-sm text-muted-foreground">
        <span>Status: Recording</span>
        <span>Duration: 00:00:00</span>
        <span>Quality: HD</span>
      </div>
    </div>
  );
};

export default VideoSection;