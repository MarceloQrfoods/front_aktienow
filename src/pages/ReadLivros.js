import React from 'react';
import { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import api from "../services/api";

function ReadLivros(props) {
  //state Snackbar
  const [snack, setSnack] = useState({ open: false, message: '' })
  //loading
  const [loading, setLoading] = useState(false);
  //timer
  const timer = React.useRef();
  //state dialog
  const [dialog, setDialog] = useState({ open: false, message: '' })
  //livro para exclusao
  const [livrodelete, setLivrodelete] = useState({ id: null, titulo: '' })
  //state livros cadastrados
  const [livros, setLivros] = useState([]);
  useEffect(() => {
    GetLivros();
  }, []);
  //busca os livros na API
  const GetLivros = async () => {
    //abre o loading
    setLoading(true)
    const result = await api('/livros');
    if(result){
      //abre o loading
      setLoading(false)
    }
    setLivros(result.data);
  };
  //deleta um livro 
  const deletelivro = (id) => {
    debugger;
    //abre o loading
    setLoading(true)
    api.delete('/livros/' + id)
      .then((result) => {
        //da um intervalo de 1 segundo para fechar o loading      
        timer.current = setTimeout(() => {
          //fecha o loading
          setLoading(false);
          //exibe a msg de sucesso
          setSnack({ open: true, message: 'Livro excluido com sucesso' })
          GetLivros()
        }, 1000);
      });
  };
  //chama a tela de edição
  const editlivro = (id) => {
    props.history.push({
      pathname: '/editlivro/' + id
    });
  };
  //chama a tela de avaliações
  const readavaliacoes = (id) => {
    props.history.push({
      pathname: '/readavaliacoes/' + id
    });
  };
  //fecha o dialog
  const closedialog = () => {
    setLivrodelete({})
    setDialog({ open: false });
  };
  //abre o dialog de exclusao
  const opendialog = (obj) => {
    setLivrodelete(obj)
    setDialog({ open: true, message: 'Tem certeza que deseja excluir o livro ' + obj.titulo + ' ?' });
  };

  //action de delete dentro do dialog
  const deletelivrodialog = () => {
    deletelivro(livrodelete.id)
    setLivrodelete({})
    setDialog({ open: false });
  }
  //fecha o snackbar
  const closeSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnack({ open: false });
    //recarrega a lista de livros
    GetLivros()
  };
  //estilo
  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
    }
  }));
  const classes = useStyles();

  return (
    <React.Fragment>
      {/*Dialog de confimação de exclusão*/}
      <Dialog
        open={dialog.open}
        onClose={closedialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialog.message}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => { closedialog() }}
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<ClearIcon />}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => { deletelivrodialog() }}
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Excluir
            </Button>
        </DialogActions>
      </Dialog>
      {/*Snackbar de msg*/}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snack.open}
        autoHideDuration={2000}
        onClose={closeSnack}
        message={snack.message}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnack}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Title>Listagem de Livros</Title>
      <Grid item xs={12}>
        {loading && <CircularProgress size={40} />}
      </Grid>
      {/*Tabela de Listagem de Livros*/}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Autor</TableCell>
            <TableCell>Resumo</TableCell>
            <TableCell>Editora</TableCell>
            <TableCell>Ano</TableCell>
            <TableCell>Gênero</TableCell>
            <TableCell align="center">Avaliações</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {livros.map((livro) => (
            <TableRow key={livro.id}>
              <TableCell>{livro.titulo}</TableCell>
              <TableCell>{livro.autor}</TableCell>
              <TableCell>{livro.resumo}</TableCell>
              <TableCell>{livro.editora}</TableCell>
              <TableCell>{livro.ano}</TableCell>
              <TableCell>{livro.genero.nome}</TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete" onClick={() => { readavaliacoes(livro.id) }}>
                  <StarIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete" onClick={() => { editlivro(livro.id) }}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => { opendialog(livro) }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
export default ReadLivros