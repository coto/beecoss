using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Data.Common;
using System.Configuration;

namespace DCE05.Ejemplos.EstrellaUno.AccesoDatos {

    /// <summary>
    /// Representa la base de datos en el sistema.
    /// Ofrece los m�todos de acceso a misma.
    /// </summary>
    public class BaseDatos {

        private DbConnection conexion = null;
		private DbCommand comando = null;
		private DbTransaction transaccion = null;
        private string cadenaConexion;
        
        private static DbProviderFactory factory = null;

        /// <summary>
        /// Crea una instancia del acceso a la base de datos.
        /// </summary>
        public BaseDatos() {
            Configurar();
        }

        /// <summary>
        /// Configura el acceso a la base de datos para su utilizaci�n.
        /// </summary>
        /// <exception cref="BaseDatosException">Si existe un error al cargar la configuraci�n.</exception>
        private void Configurar() {
            try {
                string proveedor = ConfigurationManager.AppSettings.Get("PROVEEDOR_ADONET");
                this.cadenaConexion = ConfigurationManager.AppSettings.Get("CADENA_CONEXION");
                BaseDatos.factory = DbProviderFactories.GetFactory(proveedor);
            } catch (ConfigurationException ex) {
                throw new BaseDatosException("Error al cargar la configuraci�n del acceso a datos.", ex);
            }
        }

        /// <summary>
        /// Permite desconectarse de la base de datos.
        /// </summary>
		public void Desconectar()
		{
			if( this.conexion.State.Equals(ConnectionState.Open) )
			{
                this.conexion.Close();
			}
		}

		/// <summary>
		/// Se concecta con la base de datos.
		/// </summary>
        /// <exception cref="BaseDatosException">Si existe un error al conectarse.</exception>
		public void Conectar()
		{
            if (this.conexion != null && !this.conexion.State.Equals(ConnectionState.Closed)) {
                throw new BaseDatosException("La conexi�n ya se encuentra abierta.");
            }
            try {
                if (this.conexion == null) {
                    this.conexion = factory.CreateConnection();
                    this.conexion.ConnectionString = cadenaConexion;
                }
                this.conexion.Open();
            } catch (DataException ex) {
                throw new BaseDatosException("Error al conectarse a la base de datos.", ex);
            }
		}

		/// <summary>
		/// Crea un comando en base a una sentencia SQL.
        /// Ejemplo:
        /// <code>SELECT * FROM Tabla WHERE campo1=@campo1, campo2=@campo2</code>
		/// Guarda el comando para el seteo de par�metros y la posterior ejecuci�n.
		/// </summary>
        /// <param name="sentenciaSQL">La sentencia SQL con el formato: SENTENCIA [param = @param,]</param>
		public void CrearComando(string sentenciaSQL)
		{
            this.comando = factory.CreateCommand();
            this.comando.Connection = this.conexion;
            this.comando.CommandType = CommandType.Text;
            this.comando.CommandText = sentenciaSQL;
            if (this.transaccion != null) {
                this.comando.Transaction = this.transaccion;
            }
		}

		/// <summary>
		/// Setea un par�metro como nulo del comando creado.
		/// </summary>
		/// <param name="nombre">El nombre del par�metro cuyo valor ser� nulo.</param>
		public void AsignarParametroNulo(string nombre)
		{
            AsignarParametro(nombre, "", "NULL");
		}

        /// <summary>
        /// Asigna un par�metro de tipo cadena al comando creado.
        /// </summary>
        /// <param name="nombre">El nombre del par�metro.</param>
        /// <param name="valor">El valor del par�metro.</param>
        public void AsignarParametroCadena(string nombre, string valor) {
            AsignarParametro(nombre, "'", valor);
        }

        /// <summary>
        /// Asigna un par�metro de tipo entero al comando creado.
        /// </summary>
        /// <param name="nombre">El nombre del par�metro.</param>
        /// <param name="valor">El valor del par�metro.</param>
        public void AsignarParametroEntero(string nombre, int valor) {
            AsignarParametro(nombre, "", valor.ToString());
        }

        /// <summary>
        /// Asigna un par�metro al comando creado.
        /// </summary>
        /// <param name="nombre">El nombre del par�metro.</param>
        /// <param name="separador">El separador que ser� agregado al valor del par�metro.</param>
        /// <param name="valor">El valor del par�metro.</param>
        private void AsignarParametro(string nombre, string separador, string valor) {
            int indice = this.comando.CommandText.IndexOf(nombre);
            string prefijo = this.comando.CommandText.Substring(0, indice);
            string sufijo = this.comando.CommandText.Substring(indice + nombre.Length);
            this.comando.CommandText = prefijo + separador + valor + separador + sufijo;
        }

        /// <summary>
        /// Asigna un par�metro de tipo fecha al comando creado.
        /// </summary>
        /// <param name="nombre">El nombre del par�metro.</param>
        /// <param name="valor">El valor del par�metro.</param>
		public void AsignarParametroFecha(string nombre, DateTime valor)
		{
            AsignarParametro(nombre, "'", valor.ToString());
		}

		/// <summary>
		/// Ejecuta el comando creado y retorna el resultado de la consulta.
		/// </summary>
		/// <returns>El resultado de la consulta.</returns>
        /// <exception cref="BaseDatosException">Si ocurre un error al ejecutar el comando.</exception>
		public DbDataReader EjecutarConsulta()
		{
            return this.comando.ExecuteReader();
		}

		/// <summary>
		/// Ejecuta el comando creado y retorna un escalar.
		/// </summary>
		/// <returns>El escalar que es el resultado del comando.</returns>
        /// <exception cref="BaseDatosException">Si ocurre un error al ejecutar el comando.</exception>
		public int EjecutarEscalar()
		{
            int escalar = 0;
            try {
                escalar = int.Parse(this.comando.ExecuteScalar().ToString());
            } catch (InvalidCastException ex) {
                throw new BaseDatosException("Error al ejecutar un escalar.", ex);
            }
            return escalar;
		}

		/// <summary>
		/// Ejecuta el comando creado.
		/// </summary>
		public void EjecutarComando()
		{
            this.comando.ExecuteNonQuery();
		}

		/// <summary>
		/// Comienza una transacci�n en base a la conexion abierta.
		/// Todo lo que se ejecute luego de esta ionvocaci�n estar� 
		/// dentro de una tranasacci�n.
		/// </summary>
		public void ComenzarTransaccion()
		{
			if( this.transaccion == null )
			{
				this.transaccion = this.conexion.BeginTransaction();
			}
		}

		/// <summary>
		/// Cancela la ejecuci�n de una transacci�n.
		/// Todo lo ejecutado entre �sta invocaci�n y su 
		/// correspondiente <c>ComenzarTransaccion</c> ser� perdido.
		/// </summary>
		public void CancelarTransaccion()
		{
			if( this.transaccion != null )
			{
				this.transaccion.Rollback();
			}
		}

		/// <summary>
		/// Confirma todo los comandos ejecutados entre el <c>ComanzarTransaccion</c>
		/// y �sta invocaci�n.
		/// </summary>
		public void ConfirmarTransaccion()
		{
			if( this.transaccion != null )
			{
				this.transaccion.Commit();
			}
		}

    }
}
