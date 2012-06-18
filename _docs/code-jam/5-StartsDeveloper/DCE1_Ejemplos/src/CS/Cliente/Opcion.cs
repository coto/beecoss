using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa una opci�n gen�rica.
    /// Todas las opciones del sistema deben heredar de esta opci�n.
    /// </summary>
    internal abstract class Opcion {

        private int codigo = 0;
        private string descripcion;

        /// <summary>
        /// El c�digo de la opci�n.
        /// </summary>
        protected internal int Codigo {
            get { return codigo; }
            set { codigo = value; }
        }

        /// <summary>
        /// La descripci�n de la opci�n.
        /// </summary>
        protected internal string Descripcion {
            get { return descripcion; }
            protected set { descripcion = value; }
        }

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        internal abstract void EjecutarAccion();

    }
}
