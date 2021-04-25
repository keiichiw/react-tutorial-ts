import ReactDOM from "react-dom";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";

import Game from "./game";

function Main() {
  return (
    <div>
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className="icon-button"
              color="inherit"
              aria-label="menu"
            ></IconButton>
            <Typography variant="h6" className="news">
              Tic-Tac-Toe
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Game />
    </div>
  );
}

ReactDOM.render(<Main />, document.getElementById("root"));
