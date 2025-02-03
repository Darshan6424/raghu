import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const NewsSection = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_updates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <span className="text-muted-foreground">Loading news...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Recent Updates</h2>
      <div className="grid gap-6">
        {news?.map((item) => (
          <div key={item.id} className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.content}</p>
            {item.image_url && (
              <img 
                src={item.image_url} 
                alt={item.title}
                className="mt-4 rounded-md w-full max-w-md mx-auto"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;