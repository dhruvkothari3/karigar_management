
import React from "react";
import { JobCard, JobCardProps } from "./JobCard";

interface JobCardListProps {
  jobs: JobCardProps[];
}

export function JobCardList({ jobs }: JobCardListProps) {
  return (
    <div className="space-y-6">
      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No jobs found.</p>
        </div>
      ) : (
        jobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))
      )}
    </div>
  );
}
