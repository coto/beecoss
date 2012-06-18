using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa la aplicaci�n cliente.
    /// </summary>
    public class PuntoDeVenta {

        private static bool SALIR = false;
        private static Venta venta = null;

        /// <summary>
        /// La venta actual que se est� llevando a cabo en el Punto de Venta.
        /// </summary>
        internal static Venta VentaActual{
            get { return venta; }
            set { venta = value; }
        }

        /// <summary>
        /// Controla el flujo de ejecuci�n de la aplicaci�n.
        /// </summary>
        internal void Iniciar() {
            while (!PuntoDeVenta.SALIR) {
                int opcionSeleccionada = MostrarMenu();
                try {
                    Opcion opcion = ListaOpciones.Obtener(opcionSeleccionada);
                    opcion.EjecutarAccion();
                } catch (Exception ex) {
                    Console.WriteLine(ex.Message + "\n");
                }
                Iniciar();
            }
        }

        /// <summary>
        /// Permite finalizar la aplicaci�n.
        /// </summary>
        internal static void Salir() {
            SALIR = true;
        }

        /// <summary>
        /// El punto de acceso (Entry Point) a la aplicaci�n.
        /// Este m�todo ser� invocado por el .NET Common Language Runtime.
        /// </summary>
        /// <param name="args">La lista de par�metros que son pasados por consola.</param>
        public static void Main(string[] args) {
            PuntoDeVenta p = new PuntoDeVenta();
            p.Iniciar();
        }

        /// <summary>
        /// Muestra el men� de opciones en pantalla.
        /// </summary>
        /// <returns>La opci�n de men� seleccionada por el usuario.</returns>
        private int MostrarMenu(){
            MostrarVentaActual();

            Console.WriteLine("Opciones");
            Console.WriteLine("--------\n");

            List<Opcion> opciones = ListaOpciones.ObtenerOpciones();
            foreach (Opcion opcion in opciones) {
                Console.WriteLine("{0} - {1}", opcion.Codigo, opcion.Descripcion);
            }

            Console.Write("\nOpci�n: ");
            int opcionSeleccionada = 0;
            try {
                opcionSeleccionada = int.Parse(Console.ReadLine());
            } catch (FormatException) {
                Console.Clear();
                Console.WriteLine("Opci�n Inv�lida !!");
                MostrarMenu();
            }
            Console.Clear();
            return opcionSeleccionada;
        }

        /// <summary>
        /// Muestra los datos de la venta actual.
        /// </summary>
        private void MostrarVentaActual() {
            if (PuntoDeVenta.VentaActual != null) {
                Console.WriteLine("Venta Actual: Codigo Venta: {0} - Total: {1}\n",
                    PuntoDeVenta.VentaActual.Codigo,
                    PuntoDeVenta.VentaActual.Total());
            }
        }

    }
}
