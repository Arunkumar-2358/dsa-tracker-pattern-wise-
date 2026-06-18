import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapsApi } from '../services/api';

export function useRoadmaps() {
  return useQuery({
    queryKey: ['roadmaps'],
    queryFn: async () => {
      const res = await roadmapsApi.list();
      return res.data.data;
    },
  });
}

export function useRoadmap(id: string) {
  return useQuery({
    queryKey: ['roadmaps', id],
    queryFn: async () => {
      const res = await roadmapsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateRoadmap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => roadmapsApi.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });
}

export function useDeleteRoadmap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roadmapsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });
}

export function useAddNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      roadmapId,
      data,
    }: {
      roadmapId: string;
      data: { topic: string; parentId?: string | null };
    }) => roadmapsApi.addNode(roadmapId, data),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ['roadmaps', variables.roadmapId] });
    },
  });
}

export function useDeleteNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roadmapId, nodeId }: { roadmapId: string; nodeId: string }) =>
      roadmapsApi.deleteNode(roadmapId, nodeId),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ['roadmaps', variables.roadmapId] });
    },
  });
}
