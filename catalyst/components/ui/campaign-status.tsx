"use client";

interface CampaignStatusProps {
  startDate: string;
  endDate: string;
}

export function CampaignStatus({ startDate, endDate }: CampaignStatusProps) {
  const getCampaignStatus = () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { 
      status: 'Upcoming', 
      color: 'text-muted-foreground bg-muted/50 border-border/50'
    };
    if (now > end) return { 
      status: 'Completed', 
      color: 'text-muted-foreground bg-muted/50 border-border/50'
    };
    return { 
      status: 'Active', 
      color: 'text-primary bg-primary/10 border-primary/20'
    };
  };

  const { status, color } = getCampaignStatus();

  return (
    <span className={`px-3 py-1.5 text-xs font-medium rounded-xl border ${color} transition-colors duration-200`}>
      {status}
    </span>
  );
} 