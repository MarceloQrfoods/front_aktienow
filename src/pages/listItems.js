import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { Link } from "react-router-dom";
export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/readlivros">    
      <ListItemIcon>
        <MenuBookIcon />
      </ListItemIcon>
      <ListItemText primary="Listar Livros" />      
    </ListItem>
    
    <ListItem button component={Link} to="/createlivros">
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="Novo Livro" />
    </ListItem>
  </div>
);