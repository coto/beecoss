using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa la opci�n de listar los productos disponibles.
    /// </summary>
    internal class OpcionListarProductos : Opcion {

        /// <summary>
        /// Construye una instancia de la opci�n con sus datos b�sicos.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n.</param>
        internal OpcionListarProductos(int codigo) {
            Codigo = codigo;
            Descripcion = "Listar Productos";
        }

        /// <summary>
        /// Construye una instancia de la opci�n vac�a.
        /// </summary>
        internal OpcionListarProductos() : this(0) {
        }

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        internal override void EjecutarAccion() {
            try {
                CatalogoProductos catalogo = new CatalogoProductos();
                List<Producto> productos = catalogo.ObtenerProductos();

                Console.WriteLine("Listado de Productos");
                Console.WriteLine("--------------------\n");
                Console.WriteLine("{0}\t{1}\t\t{2}", "Codigo".PadRight(7), "Descripcion".PadRight(30), "Precio");
                foreach (Producto producto in productos) {
                    Console.WriteLine("{0}\t{1}\t\t{2}", producto.Codigo.ToString().PadRight(7), producto.Descripcion.PadRight(30),
                        producto.Precio);
                }
                Console.WriteLine("\n\n");
            } catch (ReglasNegocioException ex) {
                Console.WriteLine("Error al listar los productos: " + ex.Message);
            }
        }
    }
}
