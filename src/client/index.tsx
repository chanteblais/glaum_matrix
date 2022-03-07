import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app";
import { createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <App/>
    </ThemeProvider>,
    document.getElementById("root")
);
