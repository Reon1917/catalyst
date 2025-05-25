"use client";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  description: string;
}

export function StatCard({ 
  icon: Icon, 
  value, 
  description
}: StatCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
      </div>
      <div className="text-2xl font-semibold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
} 