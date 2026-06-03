import IdeaCard from "./IdeaCard";

export default function IdeasList({ ideas, onVote, onNoVote, onUnvote }) {
  return (
    <div>
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onVote={onVote}
          onNoVote={onNoVote}
          onUnvote={onUnvote}
        />
      ))}
    </div>
  );
}
