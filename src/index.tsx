import ReactDOM from "react-dom";
import GitHubIcon from "@material-ui/icons/GitHub";
import {
  AppBar,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Game from "./game";

const useStyles = makeStyles((theme) => ({
  toolbarButtons: {
    marginLeft: "auto",
  },
}));

function Main() {
  const classes = useStyles();
  return (
    <div>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Tic-Tac-Toe</Typography>
            <div className={classes.toolbarButtons}>
              <Tooltip title="GitHub repository">
                <IconButton
                  aria-label="github"
                  color="inherit"
                  onClick={() =>
                    window.open("https://github.com/keiichiw/react-tutorial-ts")
                  }
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Game />
    </div>
  );
}

ReactDOM.render(<Main />, document.getElementById("root"));
