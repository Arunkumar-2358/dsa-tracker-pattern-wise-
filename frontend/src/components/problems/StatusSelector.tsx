import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG, type ProblemStatus } from '@/types';

interface StatusSelectorProps {
  currentStatus: ProblemStatus;
  onChange: (status: ProblemStatus) => void;
  disabled?: boolean;
}

const statusOrder: ProblemStatus[] = [
  'NOT_STARTED',
  'ATTEMPTED',
  'SOLVED',
  'REVISED',
  'MASTERED',
];

const variantMap: Record<ProblemStatus, 'notstarted' | 'attempted' | 'solved' | 'revised' | 'mastered'> = {
  NOT_STARTED: 'notstarted',
  ATTEMPTED: 'attempted',
  SOLVED: 'solved',
  REVISED: 'revised',
  MASTERED: 'mastered',
};

export function StatusSelector({ currentStatus, onChange, disabled }: StatusSelectorProps) {
  return (
    <Select value={currentStatus} onValueChange={(v) => onChange(v as ProblemStatus)} disabled={disabled}>
      <SelectTrigger className="w-36 h-8 text-xs border-none shadow-none p-0 focus:ring-0">
        <SelectValue>
          <Badge variant={variantMap[currentStatus]}>
            {STATUS_CONFIG[currentStatus].label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOrder.map((status) => (
          <SelectItem key={status} value={status}>
            <Badge variant={variantMap[status]}>{STATUS_CONFIG[status].label}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
