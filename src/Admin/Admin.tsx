import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import {
  ADMIN_TOKEN_KEY,
  AdminContest,
  ContestInput,
  UnauthorizedError,
  createContest,
  deleteContest,
  listContests,
  updateContest
} from '../util/admin-contests';

// <input type="datetime-local"> works in the browser's local time zone.
const toLocalInput = (iso: string | Date): string => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const fromLocalInput = (value: string): string => new Date(value).toISOString();

const formatDate = (iso: string | Date) => new Date(iso).toLocaleString();

const emptyForm = { title: '', timeStart: '', timeEnd: '' };

export default function Admin() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY)
  );
  const [tokenInput, setTokenInput] = useState('');
  const [contests, setContests] = useState<AdminContest[]>();
  const [isLoading, setIsLoading] = useState(false);

  // null = closed, 'new' = create, otherwise the contest being edited
  const [editing, setEditing] = useState<AdminContest | 'new' | null>(null);
  const [form, setForm] = useState<ContestInput>(emptyForm);
  const [deleting, setDeleting] = useState<AdminContest | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setContests(undefined);
  }, []);

  const handleError = useCallback(
    (err: any) => {
      if (err instanceof UnauthorizedError) {
        toast.error('Invalid admin token.');
        logout();
        return;
      }
      console.error(err);
      toast.error(err.message ?? String(err), { duration: 6000 });
    },
    [logout]
  );

  const refresh = useCallback(
    async (t: string) => {
      setIsLoading(true);
      try {
        setContests(await listContests(t));
        return true;
      } catch (err) {
        handleError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  useEffect(() => {
    if (token) refresh(token);
  }, [token, refresh]);

  const submitToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = tokenInput.trim();
    if (!t) return;
    // Only persist the token once the server has accepted it.
    if (await refresh(t)) {
      localStorage.setItem(ADMIN_TOKEN_KEY, t);
      setToken(t);
      setTokenInput('');
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditing('new');
  };

  const openEdit = (contest: AdminContest) => {
    setForm({
      title: contest.title,
      timeStart: toLocalInput(contest.timeStart),
      timeEnd: toLocalInput(contest.timeEnd)
    });
    setEditing(contest);
  };

  const saveContest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editing) return;
    const input = {
      title: form.title,
      timeStart: fromLocalInput(form.timeStart),
      timeEnd: fromLocalInput(form.timeEnd)
    };
    try {
      if (editing === 'new') {
        await createContest(token, input);
        toast.success('Contest created.');
      } else {
        await updateContest(token, editing.id, input);
        toast.success('Contest updated.');
      }
      setEditing(null);
      await refresh(token);
    } catch (err) {
      handleError(err);
    }
  };

  const confirmDelete = async () => {
    if (!token || !deleting) return;
    try {
      await deleteContest(token, deleting.id);
      toast.success('Contest deleted.');
      setDeleting(null);
      await refresh(token);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, height: 'auto', overflow: 'auto' }}>
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          {!token ? (
            <form onSubmit={submitToken}>
              <Typography component="h2" variant="h6" color="primary" sx={{ mb: 2 }}>
                Admin
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Admin token"
                  type="password"
                  autoComplete="current-password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  sx={{ minWidth: 320 }}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !tokenInput.trim()}
                  sx={{ height: '56px' }}
                >
                  Unlock
                </Button>
              </Stack>
            </form>
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography component="h2" variant="h6" color="primary">
                  Contests
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={openCreate}>
                    New contest
                  </Button>
                  <Button onClick={logout}>Log out</Button>
                </Stack>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                    <TableCell align="right">Submissions</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contests?.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.title}</TableCell>
                      <TableCell>{formatDate(c.timeStart)}</TableCell>
                      <TableCell>{formatDate(c.timeEnd)}</TableCell>
                      <TableCell align="right">{c._count.submissions}</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => setDeleting(c)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {contests?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>No contests yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </Paper>
      </Container>

      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth>
        <form onSubmit={saveContest}>
          <DialogTitle>
            {editing === 'new' ? 'New contest' : 'Edit contest'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <TextField
                label="Start (local time)"
                type="datetime-local"
                required
                InputLabelProps={{ shrink: true }}
                value={form.timeStart}
                onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
              />
              <TextField
                label="End (local time)"
                type="datetime-local"
                required
                InputLabelProps={{ shrink: true }}
                value={form.timeEnd}
                onChange={(e) => setForm({ ...form, timeEnd: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete contest?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete "{deleting?.title}"? Contests with submissions can't be
            deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
