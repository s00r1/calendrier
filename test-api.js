import { fetchAssignments, saveAssignment, deleteAssignments } from './src/data.js';
import { showRequestError } from './src/ui.js';

async function runTest(title, fn) {
  try {
    await fn();
  } catch (err) {
    showRequestError(`${title}: ${err.message}`);
  }
}

async function runTests() {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    .toISOString()
    .slice(0, 10);

  await runTest('Nettoyage initial', async () => {
    await deleteAssignments([date]);
  });

  await runTest('Écriture', async () => {
    await saveAssignment(date, '101');
    const all = await fetchAssignments();
    if (!all.some(a => a.date === date && a.chambres.includes('101'))) {
      throw new Error('valeur non retrouvée après écriture');
    }
  });

  await runTest('Lecture', async () => {
    const all = await fetchAssignments();
    if (!all.some(a => a.date === date)) {
      throw new Error('enregistrement introuvable');
    }
  });

  await runTest('Modification', async () => {
    await saveAssignment(date, '102');
    const all = await fetchAssignments();
    const record = all.find(a => a.date === date);
    if (!record || !record.chambres.includes('102')) {
      throw new Error('modification non enregistrée');
    }
  });

  await runTest('Écriture double', async () => {
    await saveAssignment(date, '201');
    await saveAssignment(date, '202');
    const all = await fetchAssignments();
    const matches = all.filter(a => a.date === date);
    if (matches.length !== 1 || matches[0].chambres.length !== 1 || matches[0].chambres[0] !== '202') {
      throw new Error('conflit sur la même date');
    }
  });

  await runTest('Effacement', async () => {
    await deleteAssignments([date]);
    const all = await fetchAssignments();
    if (all.some(a => a.date === date)) {
      throw new Error('enregistrement non supprimé');
    }
  });
}

document.addEventListener('DOMContentLoaded', runTests);
