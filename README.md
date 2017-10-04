# skysentinel

Here is the code of the server and client of skysentinel.

# server

The server is able to communicate with the ground station, using TCP socket. It retrieves and store the state of the station and the drone. Il also store information received from the user, such as the missions plans and trigers the missio when necessary, according to the weather conditions.

# client

The client is a webapp displaying informations about the ground station / drone state. It alows the user to create and triggers missions for the drone and displays the results of it.
