let mockClient;
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn(() => mockClient) }));
const { createClient } = require('@supabase/supabase-js');

let fetchAssignments;
let saveAssignment;
let deleteAssignments;

describe('fonctions Supabase', () => {
  let fromMock;
  let selectMock;
  let deleteMock;
  let insertMock;
  let upsertMock;
  let inMock;
  let eqMock;

  beforeEach(() => {
    jest.resetModules();
    inMock = jest.fn().mockResolvedValue({ error: null });
    eqMock = jest.fn().mockResolvedValue({ error: null });
    selectMock = jest.fn().mockResolvedValue({ data: [{ id: 1, due_date: '2024-01-01', title: '101' }], error: null });
    insertMock = jest.fn().mockResolvedValue({ error: null });
    upsertMock = jest.fn().mockResolvedValue({ error: null });
    deleteMock = jest.fn(() => ({ in: inMock, eq: eqMock }));
    fromMock = jest.fn(() => ({ select: selectMock, insert: insertMock, upsert: upsertMock, delete: deleteMock }));
    mockClient = { from: fromMock };

    ({ fetchAssignments, saveAssignment, deleteAssignments } = require('../src/data.node.js'));
  });

  test('fetchAssignments transforme les données', async () => {
    const res = await fetchAssignments();
    expect(fromMock).toHaveBeenCalledWith('assignments');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(res).toEqual([{ date: '2024-01-01', chambres: ['101'] }]);
  });

  test('saveAssignment ajoute ou met à jour', async () => {
    await saveAssignment('2024-01-01', '101');
    expect(fromMock).toHaveBeenCalledWith('assignments');
    expect(upsertMock).toHaveBeenCalledWith({ title: '101', due_date: '2024-01-01' }, { onConflict: ['due_date'] });
  });

  test('deleteAssignments supprime les dates', async () => {
    await deleteAssignments(['2024-01-02']);
    expect(fromMock).toHaveBeenCalledWith('assignments');
    expect(deleteMock).toHaveBeenCalled();
    expect(inMock).toHaveBeenCalledWith('due_date', ['2024-01-02']);
  });
});
