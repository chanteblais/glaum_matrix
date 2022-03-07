import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import MatrixSimulator from "./simulatorMatrix";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function PricingContent() {
    return (
        <React.Fragment>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}/>
            <CssBaseline/>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                <Toolbar sx={{ flexWrap: "wrap" }}>
                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Company name
                    </Typography>
                    <nav>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Features
                        </Link>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Enterprise
                        </Link>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Support
                        </Link>
                    </nav>
                    <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
                <Grid container>
                    <Grid item>
                        test
                    </Grid>
                    <Grid item width={"100%"}>
                        <MatrixSimulator/>
                    </Grid>
                </Grid>
            </Container>
            <Container
                maxWidth="md"
                component="footer"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    mt: 8,
                    py: [3, 6],
                }}>
                <Copyright sx={{ mt: 5 }}/>
            </Container>
            {/* End footer */}
        </React.Fragment>
    );
}

export default function Pricing() {
    return <PricingContent/>;
}
