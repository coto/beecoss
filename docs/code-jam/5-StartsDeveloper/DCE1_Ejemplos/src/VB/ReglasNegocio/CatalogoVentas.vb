Imports DCE05.Ejemplos.EstrellaUno.AccesoDatos
Imports System.Data.Common

''' <summary>
''' Representa el catálogo de ventas del sistema.
''' Permite administrar la lógica de negocios asociada a las ventas.
''' </summary>
Public Class CatalogoVentas

    ''' <summary>
    ''' Obtiene el listado de ventas registradas en el sistema.
    ''' </summary>
    ''' <returns>El listado de ventas registradas.</returns>
    ''' <exception cref="ReglasNegocioException">Si ocurre un error de negocio.</exception>
    Public Function ObtenerVentas() As List(Of Venta)
        Dim Ventas As List(Of Venta) = New List(Of Venta)()
        Try
            Dim Sql As String = "SELECT Codigo, Fecha FROM Ventas"
            Dim Db As BaseDatos = New BaseDatos()
            Db.Conectar()
            Db.CrearComando(Sql)
            Dim DatosVentas As DbDataReader = Db.EjecutarConsulta()

            Dim MiVenta As Venta = Nothing
            While DatosVentas.Read()
                Try
                    MiVenta = New Venta()
                    MiVenta.Codigo = DatosVentas.GetInt32(0)
                    MiVenta.Fecha = DatosVentas.GetDateTime(1)

                    Dim Items As List(Of ItemVenta) = ObtenerItemsVenta(MiVenta)
                    For Each item As ItemVenta In Items
                        MiVenta.AgregarItem(item)
                    Next

                    Ventas.Add(MiVenta)
                Catch Ex As InvalidCastException
                    Throw New ReglasNegocioException("Los tipos no coinciden.", Ex)
                Catch Ex As DataException
                    Throw New ReglasNegocioException("Error de ADO.NET.", Ex)
                End Try
            End While
            DatosVentas.Close()
            Db.Desconectar()
        Catch ex As BaseDatosException
            Throw New ReglasNegocioException("Error al acceder a la base de datos para obtener las ventas.")
        Catch ex As ReglasNegocioException
            Throw New ReglasNegocioException("Error a obtener las ventas. " + ex.Message)
        End Try

        Return Ventas
    End Function

    ''' <summary>
    ''' Obtiene los ítems de una venta.
    ''' </summary>
    ''' <param name="MiVenta">La venta cuyos ítems se van a obtener.</param>
    ''' <returns>Los ítems de la venta.</returns>
    ''' <exception cref="ReglasNegocioException">Si ocurre un error de negocio.</exception>
    Private Function ObtenerItemsVenta(ByVal MiVenta As Venta) As List(Of ItemVenta)
        Dim items As List(Of ItemVenta) = New List(Of ItemVenta)()

        Try
            Dim Sql As String = "SELECT Codigo, Cantidad, CodigoProducto FROM ItemsVenta WHERE CodigoVenta=@venta"
            Dim Db As BaseDatos = New BaseDatos()
            Db.Conectar()
            Db.CrearComando(Sql)
            Db.AsignarParametroEntero("@venta", MiVenta.Codigo)
            Dim DatosItems As DbDataReader = Db.EjecutarConsulta()

            Dim Item As ItemVenta = Nothing
            Dim Catalogo As CatalogoProductos = New CatalogoProductos()
            While DatosItems.Read()
                Try
                    Dim MiProducto As Producto = Catalogo.ObtenerProducto(DatosItems.GetInt32(2))
                    Item = New ItemVenta(DatosItems.GetInt32(0), MiProducto, DatosItems.GetInt32(1))

                    MiVenta.AgregarItem(Item)
                Catch Ex As InvalidCastException
                    Throw New ReglasNegocioException("Los tipos no coinciden.", Ex)
                Catch Ex As DataException
                    Throw New ReglasNegocioException("Error de ADO.NET.", Ex)
                End Try
            End While
            DatosItems.Close()
            Db.Desconectar()
        Catch ex As BaseDatosException
            Throw New ReglasNegocioException("Error al acceder a la base de datos para obtener los ítems de venta.")
        Catch ex As ReglasNegocioException
            Throw New ReglasNegocioException("Error a obtener los ítems de venta. " + ex.Message)
        End Try
        Return items
    End Function

    ''' <summary>
    ''' Confirma una venta registrando sus ítems en el sistema.
    ''' La venta debe poseer items.
    ''' </summary>
    ''' <param name="MiVenta">La venta a registrar.</param>
    ''' <exception cref="ReglasNegocioException">Si ocurre un error de negocio.</exception>
    Public Sub ConfirmarVenta(ByVal MiVenta As Venta)
        If MiVenta.Items.Count.Equals(0) Then
            Throw New ReglasNegocioException("La venta no contiene ningún ítem.")
        End If

        Dim Db As BaseDatos = New BaseDatos()
        Try
            Db.Conectar()
            Db.ComenzarTransaccion()

            Dim Sql As String = "INSERT ItemsVenta (CodigoVenta, CodigoProducto, Cantidad) VALUES (@venta, @producto, @cantidad) SELECT @@IDENTITY"
            For Each Item As ItemVenta In MiVenta.Items
                Db.CrearComando(Sql)
                Db.AsignarParametroEntero("@venta", MiVenta.Codigo)
                Db.AsignarParametroEntero("@producto", Item.Producto.Codigo)
                Db.AsignarParametroEntero("@cantidad", Item.Cantidad)
                Item.Codigo = Db.EjecutarEscalar()
            Next

            Db.ConfirmarTransaccion()
        Catch Ex As BaseDatosException
            Db.CancelarTransaccion()
            Throw New ReglasNegocioException("Error al registrar la venta.", Ex)
        Finally
            Db.Desconectar()
        End Try
    End Sub

    ''' <summary>
    ''' Inicia una nueva venta en el sistema.
    ''' </summary>
    ''' <returns>La venta iniciada.</returns>
    ''' <exception cref="ReglasNegocioException">Si ocurre un error de negocio.</exception>
    Public Function IniciarVenta() As Venta
        Dim MiVenta As Venta = New Venta()

        Dim Db As BaseDatos = New BaseDatos()
        Try
            Db.Conectar()
            Dim Sql As String = "INSERT Ventas (Fecha) VALUES (DEFAULT) SELECT @@IDENTITY"
            Db.CrearComando(Sql)
            MiVenta.Codigo = Db.EjecutarEscalar()
        Catch Ex As BaseDatosException
            Throw New ReglasNegocioException("Error al iniciar la venta.", Ex)
        Finally
            Db.Desconectar()
        End Try

        Return MiVenta
    End Function


    ''' <summary>
    ''' Cancela las ventas pendientes (iniciadas pero que no poseen ítems).
    ''' </summary>
    ''' <exception cref="ReglasNegocioException">Si ocurre un error de negocio.</exception>
    Public Sub CancelarVentasPendientes()
        Try
            Dim Ventas As List(Of Venta) = ObtenerVentas()
            For Each MiVenta As Venta In Ventas
                If MiVenta.Items.Equals(0) Then
                    CancelarVenta(MiVenta)
                End If
            Next
        Catch ex As Exception
            Throw New ReglasNegocioException("Error al cancelar las ventas vacías.", ex)
        End Try
    End Sub

    ''' <summary>
    ''' Cancela una venta.
    ''' </summary>
    ''' <param name="MiVenta">La venta a cancelar.</param>
    ''' <exception cref="ReglasNegocioException">Si ocurre un error de negocio.</exception>
    Public Sub CancelarVenta(ByVal MiVenta As Venta)
        Dim Db As BaseDatos = New BaseDatos()
        Try
            Db.Conectar()
            Db.ComenzarTransaccion()

            Dim Sql As String = "DELETE ItemsVenta WHERE Codigo = @codigo"
            For Each Item As ItemVenta In MiVenta.Items
                Db.CrearComando(Sql)
                Db.AsignarParametroEntero("@codigo", Item.Codigo)
                Db.EjecutarComando()
            Next

            Sql = "DELETE Ventas WHERE Codigo = @codigo"
            Db.CrearComando(Sql)
            Db.AsignarParametroEntero("@codigo", MiVenta.Codigo)
            Db.EjecutarComando()

            Db.ConfirmarTransaccion()
        Catch Ex As BaseDatosException
            Db.CancelarTransaccion()
            Throw New ReglasNegocioException("Error al cancelar la venta.", Ex)
        Finally
            Db.Desconectar()
        End Try
    End Sub


End Class
