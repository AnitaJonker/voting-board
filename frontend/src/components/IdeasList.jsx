import IdeaCard from "./IdeaCard";

export default function IdeasList({ ideas, onVote, onUnvote }) {
  return (
    <div>
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onVote={onVote}
          onUnvote={onUnvote}
        />
      ))}
    </div>
  );
}
