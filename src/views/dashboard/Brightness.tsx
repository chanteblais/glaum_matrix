// ** MUI Imports
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Slider, Stack } from "@mui/material";

const Brightness = () => {
  return (
    <Card sx={{ position: "relative" }}>
      <CardContent>
        <Typography variant="h6">Brightness</Typography>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <LightModeIcon sx={{ fontSize: "1.3rem" }}/>
          <Slider aria-label="Volume" value={10}/>
          <LightModeIcon sx={{ fontSize: "1.75rem" }}/>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Brightness;
