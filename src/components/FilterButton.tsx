import { useState } from 'react';

export type TravelStatus = '전체' | '예정된 여행' | '진행 중인 여행' | '지난 여행';

interface FilterButtonProps {
  status: TravelStatus;
  activeStatus: TravelStatus;
  onClick: (status: TravelStatus) => void;
}

const FilterButton = ({ status, activeStatus, onClick }: FilterButtonProps) => (
  <button
    onClick={() => onClick(status)}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out
      ${activeStatus === status 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
  >
    {status}
  </button>
);

interface TravelStatusFilterProps {
  onStatusChange: (status: TravelStatus) => void;
  initialStatus?: TravelStatus;
}

export default function TravelStatusFilter({ 
  onStatusChange,
  initialStatus = '전체'
}: TravelStatusFilterProps) {
  const [activeStatus, setActiveStatus] = useState<TravelStatus>(initialStatus);

  const handleStatusChange = (status: TravelStatus) => {
    setActiveStatus(status);
    onStatusChange(status);
  };

  const statuses: TravelStatus[] = ['전체', '예정된 여행', '진행 중인 여행', '지난 여행'];

  return (
    <div className="flex gap-3 mt-6 mb-4 overflow-x-auto pb-2">
      {statuses.map((status) => (
        <FilterButton
          key={status}
          status={status}
          activeStatus={activeStatus}
          onClick={handleStatusChange}
        />
      ))}
    </div>
  );
}