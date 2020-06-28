import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import Title from './Title';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import api from "../services/api";

function EditLivros(props) {
  //state Snackbar
  const [snack, setSnack] = useState({open:false,message:''})
  //loading
  const [loading, setLoading] = useState(false);
  //timer
  const timer = React.useRef();
  //state generos[]
  const [generos, setGeneros] = useState([]);  
  //state livros []
  const [livro, setlivro] = useState({id: '', titulo: '', autor: '', resumo: '', editora: '', ano: '', genero_id: ''});
  //carrega os generos cadastrados para carregar o select
  const GetGeneros = async () => {
    const result = await api('/generos');
    setGeneros(result.data);
  };
  //busca o livro  a ser editado
  const GetLivro = async () => {
    const result = await api('/livros/' + props.match.params.id);
    setlivro(result.data);
  };
  //fecha o snackbar
  const closeSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }    
    setSnack({open:false});
    //direciona para a listagem de livros
    props.history.push('/readlivros')    
  };
  
  useEffect(() => {
    GetLivro();
    GetGeneros();
  }, []);

  const UpdateLivro = (e) => {
    e.preventDefault();
    //abre o loading
    setLoading(true)
    const data = {
      id: props.match.params.id,
      titulo: livro.titulo,
      autor: livro.autor,
      resumo: livro.resumo,
      editora: livro.editora,
      ano: livro.ano,
      genero_id: livro.genero_id
    };
      api.put('/livros/' + props.match.params.id, data)
      .then((result) => {  
        //da um intervalo de 1 segundo para fechar o loading      
        timer.current = setTimeout(() => {          
          //fecha o loading
          setLoading(false);
          //exibe a msg de sucesso
          setSnack({open:true, message:'Livro alterado com sucesso'})
          //espera um segundo para direcionar para a listagem de Livros
          timer.current = setTimeout(()=>{
            props.history.push('/readlivros')
          },1000);          
        }, 1000);        
      });    
  };
  //direciona pra tela de listagem de livros
  const cancelar = (e) => {
    props.history.push('/readlivros')
  };
  //altera o estado do livro quando a um on change no input
  const onChange = (e) => {
    e.persist();
    setlivro({ ...livro, [e.target.name]: e.target.value });
  }
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
      <Title>Edição de Livros</Title>
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
      <form onSubmit={UpdateLivro}>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="titulo"
              name="titulo"
              label="Título"
              fullWidth
              value={livro.titulo}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="autor"
              name="autor"
              label="Autor"
              fullWidth
              value={livro.autor}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="resumo"
              name="resumo"
              label="Resumo"
              fullWidth
              multiline
              rows={4}
              value={livro.resumo}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="editora"
              name="editora"
              label="Editora"
              fullWidth
              value={livro.editora}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              required
              id="ano"
              name="ano"
              label="Ano"
              fullWidth
              value={livro.ano}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              id="select-genero"
              value={livro.genero_id}
              onChange={onChange}
              select
              label="Selecione o genero do livro"
              name="genero_id"
            >
              {generos.map((genero) => (
                <MenuItem key={genero.id} value={genero.id}>{genero.nome}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} className={classes.buttons}>
            <Button
              onClick={() => { cancelar() }}
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<ClearIcon />}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<EditIcon />}
            >
              Editar
            </Button>
          </Grid>
          <Grid item xs={12}>
            {loading && <CircularProgress size={40}/>} 
          </Grid>              
        </Grid>
      </form>
    </React.Fragment>
  )
}
export default EditLivros  
