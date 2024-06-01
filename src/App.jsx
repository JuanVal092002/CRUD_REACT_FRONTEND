import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';

class App extends React.Component {
  state = {
    data: [],
    form: {
      id: '',
      nombre: '',
      descripcion: ''
    },
    modalInsertar: false,
    modalEditar: false,
  };
   
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const response = await fetch('http://localhost/ApiRestPhp_CRUD_REACT/index.php');
    const data = await response.json();
    this.setState({ data });
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  };

  mostrarModalInsertar = () => {
    this.setState({ modalInsertar: true });
  }

  ocultarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: registro });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  insertar = async () => {
    const { nombre, descripcion } = this.state.form;
    if (!nombre || !descripcion) {
      swal("Campos vacíos", "Por favor completa todos los campos", "error");
      return;
    }
    await fetch('http://localhost/ApiRestPhp_CRUD_REACT/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.form),
    });
    this.fetchData();
    this.setState({ modalInsertar: false });
    swal("Usuario añadido", "El usuario ha sido añadido exitosamente", "success");
  }

  editar = async () => {
    const { nombre, descripcion } = this.state.form;
    if (!nombre || !descripcion) {
      swal("Campos vacíos", "Por favor completa todos los campos", "error");
      return;
    }
    await fetch('http://localhost/ApiRestPhp_CRUD_REACT/index.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.form),
    });
    this.fetchData();
    this.setState({ modalEditar: false });
    swal("Usuario editado", "El usuario ha sido editado exitosamente", "success");
  }

  eliminar = async (dato) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no hay vuelta atras ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost/ApiRestPhp_CRUD_REACT/index.php?id=${dato.id}`, {
          method: 'DELETE',
        }).then(() => {
          this.fetchData();
          swal("Usuario eliminado", "El usuario ha sido eliminado exitosamente", "success");
        });
      } else {
        swal("Tu usuario está a salvo");
      }
    });
  }

  render() {
    return (
      <>
        <Container style={{ marginTop: '20px' }}>
          <Button color='success' onClick={this.mostrarModalInsertar}>Añadir</Button>

          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.nombre}</td>
                  <td>{elemento.descripcion}</td>
                  <td>
                    <Button color="primary" onClick={() => this.mostrarModalEditar(elemento)}>Editar</Button>{" "}
                    <Button color="danger" onClick={() => this.eliminar(elemento)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Insertar Registro</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className='form-control' readOnly type='text' value={this.state.form.id || (this.state.data.length + 1)} />
            </FormGroup>
            <FormGroup>
              <label>Nombre:</label>
              <input className='form-control' name='nombre' type='text' onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Descripción:</label>
              <input className='form-control' name='descripcion' type='text' onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.insertar}>Insertar</Button>
            <Button color='danger' onClick={this.ocultarModalInsertar}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar Registro</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className='form-control' readOnly type='text' value={this.state.form.id} />
            </FormGroup>
            <FormGroup>
              <label>Nombre:</label>
              <input className='form-control' name='nombre' type='text' onChange={this.handleChange} value={this.state.form.nombre} />
            </FormGroup>
            <FormGroup>
              <label>Descripción:</label>
              <input className='form-control' name='descripcion' type='text' onChange={this.handleChange} value={this.state.form.descripcion} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.editar}>Editar</Button>
            <Button color='danger' onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default App;
