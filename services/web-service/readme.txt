It handles all RPC calls except send_message(). 
Users talk to this service for authentication, join/leave groups, etc. 
No WebSocket is needed here since all calls are client-initiated and HTTP-based.