import React from 'react';
import { StarIcon } from 'lucide-react';
import { Avatar } from './ui/Avatar';
interface ReviewCardProps {
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
}
export function ReviewCard({
  name,
  avatar,
  rating,
  date,
  comment
}: ReviewCardProps) {
  return <div className="bg-white rounded-card p-5 shadow-card">
      <div className="flex items-start gap-4">
        <Avatar src={avatar} name={name} size="md" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-primary">{name}</h4>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>;
}