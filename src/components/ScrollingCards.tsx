const cards = [
  { id: 1, title: "Card 1" },
  { id: 2, title: "Card 2" },
  { id: 3, title: "Card 3" },
  { id: 4, title: "Card 4" },
  { id: 5, title: "Card 5" },
];

const ScrollingCards = () => {
  return (
    <div className="w-full mt-8">
      <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex-none w-64 h-48 bg-card rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-semibold">{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingCards;