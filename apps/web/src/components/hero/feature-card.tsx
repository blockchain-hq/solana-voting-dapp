import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = (props: FeatureCardProps) => {
  const { title, description, icon } = props;

  return (
    <div className="flex flex-col p-4 shadow-md shadow-gray-500/50 bg-gray-800/50 rounded-md gap-2">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;
