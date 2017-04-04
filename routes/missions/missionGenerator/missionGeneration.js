
/*
DEBUG
var lat=47.230110; //-35.3632621765 //43.785273
var longi=-1.464834; //149.165237427 //4.957509
var largeur=72;//71.33
var hauteur=88; //51.91
var angle_ini=-0.65135688; //-37.32° --> 0.65135688  //-10°; -0.18238691
var espacement=8;
var pt_m=2.0; //freq des points
var home_alt=0.0; //3.00
var mission_alt=2.0; //590.0//2.00
var inputAR = false; //aller retour
var delta = 0;


var res = missionStock(lat, longi, hauteur, largeur, angle_ini, espacement, pt_m, home_alt, mission_alt, delta, inputAR);
console.log(res["ap"]); */

function missionStock(lat, longi, hauteur, largeur, angle_ini, espacement, pt_m, home_alt, mission_alt, delta, inputAR)
{
	var AR;
	if(inputAR) AR=1;
	else AR=0;



	var ref = 0;


	//Initialisation
	//$tmp=NULL;
	//$wp_tab=NULL;
	var n=0;
	var n_wp=2;
	var n_wp2=0;
	var i_wp=0;
	var nb_wp=0;
	var unite=0.000009; //conversion en mètre
	var earth_radius=6378137.0;
	var off_angle=0;
	var temperature=1;
	var humidite=2;

	//////////////////////////////////////////////////// GESTION de fichier ///////////////////////////////////////////////////

	var missionData = "";
	var missionMap = new Array();

	/*
	//Entete de fichier KML
	fprintf($kml, "<kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>BeeTag Data</name><Style id=\"icon\"><IconStyle><Icon><href>pin.png</href></Icon></IconStyle></Style>");
	*/

	missionData += "QGC WPL 110\n";
	//DO_SET_HOME 16
	missionData += "0\t1\t0\t16\t0\t0\t0\t0\t"+lat+"\t"+longi+"\t"+home_alt+"\t1\n";
	//TAKE OFF 22
	missionData += "1\t0\t3\t22\t0.000000\t0.000000\t0.000000\t0.000000\t"+lat+"\t"+longi+"\t"+mission_alt+"\t1\n";

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//Calculs préliminaires
	var nb_rang= Math.round(largeur/espacement);
	var nb_pt_rang= Math.round(hauteur/pt_m);
	var nb_pt_jonction= Math.round(espacement/pt_m);


	if(AR==0){
		nb_wp= (nb_rang*2)+2;
		nb_pt_total= (nb_pt_rang+1)*(nb_rang+1) + (nb_pt_jonction)*(nb_rang)-1;
		distance= (nb_rang-1)*espacement + nb_rang*hauteur;
	}
	else if (AR==1){
		nb_wp= 2*((nb_rang*2)+2);
		nb_pt_total= (nb_pt_rang+1)*(nb_rang+1) + (nb_pt_jonction)*(nb_rang)-1;
		distance= (nb_rang-1)*espacement + 2*nb_rang*hauteur;
	}
	var duree=(distance/5)/60;

	//Gestion du changement de sens du parcours
	if (ref==0) off_angle=0;
	if (ref==1) off_angle= -Math.PI;


	var angle=angle_ini+off_angle;

	var tmp = [];
	var wp_tab = [];


	//printf("Distance totale: %.2f m\n", $distance);
	//printf("Nb points mission: %d\n", $nb_pt_total);
	//printf("Durée mission: %.2f min\n", $duree);

	//Parcours et sauvegarde des points de la mission

	for(var i=0; i<nb_rang+1; i++){

		//points couloirs
		for(var j=0; j<nb_pt_rang; j++){
			if(i%2 ==0 || AR==1){//si rang pair
				tmp[n]=new Array(2);
				if(tmp[n][1]==undefined && tmp[n][0]==undefined){tmp[n][1]=0;tmp[n][0]=0;}
				tmp[n][1]+= i*espacement;
				tmp[n][0]+= j*pt_m ;
				//tmp[n][1]+= i*espacement ;
				//tmp[n][0]+= j*pt_m ;
			}
			else{
				tmp[n]=new Array(2);
				if(tmp[n][1]==undefined && tmp[n][0]==undefined){tmp[n][1]=0;tmp[n][0]=0;}
				tmp[n][1]+= i*espacement ;
				tmp[n][0]+= (hauteur-(j*pt_m)) ;
			}

			//Rotation en fonction de l'angle
			x=tmp[n][1];
			y=tmp[n][0];

			tmp[n][1]= x*Math.cos(angle) + y*Math.sin(angle);
			tmp[n][0]= -x*Math.sin(angle) + y*Math.cos(angle);
			//printf("%f / %f",x,$tmp[n][1]);
			n++;
		}

		//points jonction fin de rangs
		if(i<(nb_rang)){ //si pas encore le dernier rang
			for(var j=0; j<nb_pt_jonction+1; j++){
				if(i%2==0 && AR==0){//si rang pair
					tmp[n]=new Array(2);
					if(tmp[n][1]==undefined && tmp[n][0]==undefined){tmp[n][1]=0;tmp[n][0]=0;}
					tmp[n][1]+= (i*espacement + j*pt_m) ;
					tmp[n][0]+= hauteur ;

					//Rotation en fonction de l'angle
					x=tmp[n][1];
					y=tmp[n][0];

					tmp[n][1]= x*Math.cos(angle) + y*Math.sin(angle);
					tmp[n][0]= -x*Math.sin(angle) + y*Math.cos(angle);

				}
				else
				{
					tmp[n]=new Array(2);
					if(tmp[n][1]==undefined && tmp[n][0]==undefined){tmp[n][1]=0;tmp[n][0]=0;}
					tmp[n][1]+= (i*espacement + j*pt_m);
					tmp[n][0]+= 0;

					//Rotation en fonction de l'angle
					x=tmp[n][1];
					y=tmp[n][0];

					tmp[n][1]= x*Math.cos(angle) + y*Math.sin(angle);
					tmp[n][0]= -x*Math.sin(angle) + y*Math.cos(angle);
				}
				n++;
			}
		}



		//Points WP
		if(AR==0){
			if(i%2==0){//si rang pair
				wp_tab[i_wp]=new Array(2);
				wp_tab[i_wp][1]=i*espacement;
				wp_tab[i_wp][0]=0;
				i_wp++;
				wp_tab[i_wp]=new Array(2);
				wp_tab[i_wp][1]=i*espacement;
				wp_tab[i_wp][0]=hauteur;
				i_wp++;
			}
			else{
				wp_tab[i_wp]=new Array(2);
				wp_tab[i_wp][1]=i*espacement;
				wp_tab[i_wp][0]=hauteur;
				i_wp++;
				wp_tab[i_wp]=new Array(2);
				wp_tab[i_wp][1]=i*espacement;
				wp_tab[i_wp][0]=0;
				i_wp++;
			}
		}//Points WP
		else if(AR==1){
			wp_tab[i_wp]=new Array(2);
			wp_tab[i_wp][1]=i*espacement;
			wp_tab[i_wp][0]=0;
			i_wp++;
			wp_tab[i_wp]=new Array(2);
			wp_tab[i_wp][1]=i*espacement;
			wp_tab[i_wp][0]=hauteur;
			i_wp++;
			wp_tab[i_wp]=new Array(2);
			wp_tab[i_wp][1]=i*espacement;
			wp_tab[i_wp][0]=hauteur;
			i_wp++;
			wp_tab[i_wp]=new Array(2);
			wp_tab[i_wp][1]=i*espacement;
			wp_tab[i_wp][0]=0;
			i_wp++;
		}



	}//fin for nb_rang

	//GOOOOOOOOOOD



	//Offset de la position et conversion en Long/Lat

	for (var n=0; n<nb_pt_total; n++){
		x=tmp[n][1];
		y=tmp[n][0];

		dLat = y/earth_radius;
		dLon = x/(earth_radius * Math.cos(Math.PI*lat/180));

		newlat = lat + (dLat * 180/Math.PI);
		newlon = longi + (dLon * 180/Math.PI);

		tmp[n][0]=newlat;
		tmp[n][1]=newlon;

		//Impression à l'ecran et dans le fichier
		missionMap[n] = new Object();
		missionMap[n].lat = tmp[n][0];
		missionMap[n].lng = tmp[n][1];
		var test="";
		test+=n + " lat: " + tmp[n][0] + " long: " + tmp[n][1]
		console.log(test)
		//console.log(n + " lat: " + tmp[n][0] + " long: " + tmp[n][1]);

		//fprintf(kml, "<Placemark><name></name><styleUrl>#icon</styleUrl><ExtendedData>\n<Data name=\"Temperature\"><value>%f</value>\n</Data>\n<Data name=\"Humidité\"><value>%f</value></Data></ExtendedData>\n<Point><altitudeMode>relativeToGround</altitudeMode><coordinates>%f,%f,%f</coordinates></Point></Placemark>", temperature, humidite, tmp[n][1],tmp[n][0], mission_alt );

	}

	//Conversion Lat/Long des WPs
	//Offset de la position
	//Enregistrement dans fichier
	for(var n_wp2=0; n_wp2<nb_wp; n_wp2++)
	{
		//Conversion Lat/Long
		x=wp_tab[n_wp2][1];
		y=wp_tab[n_wp2][0];

		wp_tab[n_wp2][1]= x*Math.cos(angle) + y*Math.sin(angle); //regarder les arrondis !
		wp_tab[n_wp2][0]= -x*Math.sin(angle) + y*Math.cos(angle);

		x=wp_tab[n_wp2][1];
		y=wp_tab[n_wp2][0];

		//Offsets de la position
		dLat = y/earth_radius;
		dLon = x/(earth_radius * Math.cos(Math.PI*lat/180));

		newlat = lat + (dLat * 180/Math.PI);
		newlon = longi + (dLon * 180/Math.PI);

		wp_tab[n_wp2][0]=newlat;
		wp_tab[n_wp2][1]=newlon;

		//Si le drone peut passer d'une passe à l'autre des deux cotés de la zone
		/*if(AR==0){
			//CAM TRIG DIST 206
			if(n_wp2==0){
				fprintf(wp, "%d\t0\t3\t206\t%f\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n", n_wp, pt_m);
				n_wp++;
			}
			//WP 16 attente de 0.5 sec
			fprintf(wp, "%d\t0\t3\t16\t%f\t0.000000\t0.000000\t0.000000\t%f\t%f\t%f\t1\n",n_wp, delta, wp_tab[n_wp2][0], wp_tab[n_wp2][1], mission_alt);
			n_wp++;
			//CAM TRIG DIST 206
			if(n_wp2==(nb_wp-1)){
				fprintf(wp, "%d\t0\t3\t206\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n", n_wp);
				n_wp++;
			}
		}*/
		if(AR==1 || AR==0){
			//CAM TRIG DIST 206
			if(n_wp2==0){
				missionData += n_wp+"\t0\t3\t206\t"+pt_m+"\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
				n_wp++;
			}

			//WP 16 attente de 0.5 sec
			missionData += n_wp+"\t0\t3\t16\t"+delta+"\t0.000000\t0.000000\t0.000000\t"+wp_tab[n_wp2][0]+"\t"+wp_tab[n_wp2][1]+"\t"+mission_alt+"\t1\n";
			n_wp++;

			//CAM TRIG DIST 206
			if(n_wp2==(nb_wp-1)){
				missionData += n_wp+"\t0\t3\t206\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
				n_wp++;
			}

		}

	}

	//Si le dernier WP est de l'autre coté du point de décollage alors on ajoute un wp pour pas que le drone traverse la serre en diagonal
	if((nb_rang)%2==0 && AR==0)
	{
		missionData += n_wp+"\t0\t3\t16\t"+delta+"\t0.000000\t0.000000\t0.000000\t"+wp_tab[n_wp2-2][0]+"\t"+wp_tab[n_wp2-2][1]+"\t"+mission_alt+"\t1\n";
		n_wp++;
	}

	/*
	//En pied fichier KML
	fprintf(kml, "</Document></kml>");*/

	//RTL 20
	//fprintf(wp, "%d\t0\t3\t20\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1", n_wp);

	//LANDING 21
	missionData += n_wp+"\t0\t3\t21\t0.000000\t0.000000\t0.000000\t0.000000\t"+lat+"\t"+longi+"\t0.000000\t1";

	//GOOOOOODDD

	console.log("POINT 1");
	console.log(missionMap[1].lat);
	console.log(missionMap[1].lng);

	var returnMission = {missionData : missionData, missionMap: missionMap};

	return returnMission;


	/*echo '<meta http-equiv="refresh" content="0;URL=historic.php">';*/

}


module.exports.missionStock = missionStock;
