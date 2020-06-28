import React from 'react';
import { useState, useEffect } from 'react' 
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import api from "../services/api";

function ReadAvaliacoes(props) {  
  const [avaliacoes, setAvaliacoes] = useState([]);  
  useEffect(() => {     
    GetAvaliacoes();  
  }, []);
  
  const GetAvaliacoes = async () => {  
    const result = await api('/avaliacoes/livro/'+ props.match.params.id);  
    setAvaliacoes(result.data);  
  };

  return (
    <React.Fragment>
      <Title>Avaliações do livro</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Descricao</TableCell>
            <TableCell>Nota</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {avaliacoes.map((avaliacao) => (
            <TableRow key={avaliacao.id}>
              <TableCell>{avaliacao.user.username}</TableCell> 
              <TableCell>{avaliacao.descricao}</TableCell>              
              <TableCell>{avaliacao.nota}</TableCell>             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
export default ReadAvaliacoes