<%
/**** Delay ****/
const int wait = 2000;
System.Threading.Thread.Sleep(wait);

/**** Exception ****/
//throw new Exception("Error forced");
Response.StatusCode = 403;
Response.StatusDescription = "Gets or sets the HTTP status string of the output returned to the client.";
Response.Write("{\"getType\":\"Antaios.DTO.Exceptions.PublicException\",\"message\":\"El nombre de usuario o la contrase�a no son v�lidos\"}");
Response.Flush();
Response.End();
%>