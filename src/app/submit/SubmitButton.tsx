import { Button } from '@mui/material';
import { useFormStatus } from 'react-dom';

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={pending}
      sx={{ mr: 2 }}
    >
      Submit
    </Button>
  );
};
