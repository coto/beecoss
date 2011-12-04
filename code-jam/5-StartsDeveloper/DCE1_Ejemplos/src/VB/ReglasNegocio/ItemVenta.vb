''' <summary>
''' Representa un ítem en una venta.
''' </summary>
Public Class ItemVenta

    Private _Codigo As Integer
    Private _Venta As Venta
    Private _Producto As Producto
    Private _Cantidad As Integer

    ''' <summary>
    ''' Cosntruye una instancia del ítem con los datos básicos.
    ''' </summary>
    ''' <param name="Prod">El producto asociado.</param>
    ''' <param name="Cantidad">La cantidad de unidades del producto.</param>
    Public Sub New(ByVal Prod As Producto, ByVal Cantidad As Integer)
        Me.New(0, Prod, Cantidad)
    End Sub

    ''' <summary>
    ''' Construye una inastancia del ítem completo.
    ''' </summary>
    ''' <param name="Codigo">El código del ítem</param>
    ''' <param name="Prod">El producto asociado.</param>
    ''' <param name="Cantidad">La cantidad de unidades del producto.</param>
    Public Sub New(ByVal Codigo As Integer, ByVal Prod As Producto, ByVal Cantidad As Integer)
        Me._Codigo = Codigo
        Me.Producto = Prod
        Me.Cantidad = Cantidad
    End Sub

    ''' <summary>
    ''' El código del ítem.
    ''' </summary>
    ''' <exception cref="ArgumentException">Si el parámetro es inválido.</exception>
    Public Property Codigo() As Integer
        Get
            Return Me._Codigo
        End Get

        Friend Set(ByVal Value As Integer)
            If Value <= 0 Then
                Throw New ArgumentException("El código es inválido.")
            End If
            Me._Codigo = Value
        End Set
    End Property

    ''' <summary>
    ''' El producto del ítem.
    ''' </summary>
    ''' <exception cref="ArgumentException">Si el parámetro es inválido.</exception>
    Public Property Producto() As Producto
        Private Set(ByVal Value As Producto)
            If Value Is Nothing Then
                Throw New ArgumentException("El producto no puede ser nulo.")
            End If
            Me._Producto = Value
        End Set
        Get
            Return Me._Producto
        End Get
    End Property

    ''' <summary>
    ''' La cantidad de productos en el ítem.
    ''' </summary>
    ''' <exception cref="ArgumentException">Si el parámetro es inválido.</exception>
    Public Property Cantidad() As Integer
        Private Set(ByVal Value As Integer)
            If Value <= 0 Then
                Throw New ArgumentException("La cantidad es inválida.")
            End If
            Me._Cantidad = Value
        End Set
        Get
            Return Me._Cantidad
        End Get
    End Property

    ''' <summary>
    ''' Calcula el total del ítem de venta.
    ''' </summary>
    ''' <returns>El total del ítem.</returns>
    Public Function CalcularTotal() As Double
        Return Producto.Precio * Cantidad
    End Function

End Class
