import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

export default function DocSkeleton() {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Stack spacing={2}>
        <Skeleton
          variant="rectangular"
          sx={{
            pt: "70.25%",
          }}
        />
        <Skeleton variant="rectangular" height={25} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton variant="rectangular" width={120} height={25} />
          <Skeleton variant="circular" width={25} height={25} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Skeleton variant="rectangular" width={70} height={25} />
            <Skeleton variant="rectangular" width={70} height={25} />
          </Box>
          <Skeleton variant="circular" width={25} height={25} />
        </Box>
      </Stack>
    </Grid>
  );
}
