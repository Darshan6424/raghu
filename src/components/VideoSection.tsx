
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VideoSection = () => {
  const { toast } = useToast();

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['expert-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load expert videos",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full rounded-xl bg-muted p-4 mt-6">
        <div className="aspect-video w-full bg-secondary/20 rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Loading video...</span>
        </div>
      </div>
    );
  }

  if (error || !videos || videos.length === 0) {
    return (
      <div className="w-full rounded-xl bg-muted p-4 mt-6">
        <div className="aspect-video w-full bg-secondary/20 rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">No video available</span>
        </div>
      </div>
    );
  }

  const video = videos[0];

  return (
    <div className="w-full rounded-xl bg-muted p-4 mt-6">
      <div className="aspect-video w-full bg-secondary/20 rounded-lg overflow-hidden">
        <iframe
          src={video.video_url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-lg">{video.title}</h3>
        {video.description && (
          <p className="text-sm text-muted-foreground mt-2">{video.description}</p>
        )}
      </div>
    </div>
  );
};

export default VideoSection;
