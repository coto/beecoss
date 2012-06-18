using System;
using System.Collections.Generic;
using System.Text;

namespace DCE05.Ejemplos.EstrellaUno.AccesoDatos {

    /// <summary>
    /// Representa un error de acceso a la base de datos.
    /// </summary>
    public class BaseDatosException : ApplicationException {

        /// <summary>
        /// Construye una instancia en base a un mensaje de error y la una excepci�n original.
        /// </summary>
        /// <param name="mensaje">El mensaje de error.</param>
        /// <param name="original">La excepci�n original.</param>
        public BaseDatosException(string mensaje, Exception original) : base(mensaje, original) { }

        /// <summary>
        /// Construye una instancia en base a un mensaje de error.
        /// </summary>
        /// <param name="mensaje">El mensaje de error.</param>
        public BaseDatosException(string mensaje) : base(mensaje) { }
    }
}
