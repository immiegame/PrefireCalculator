const testTrack = {
    Track1: {
        Spline: 
            [
                [0, 0],
                [1000, 1000]                    
            ], 
        TrackLength: 1414
    }
}

const player = {
    projectileSpeed: 10,
    position: [0.4, 0.5]
}

const enemy = {
    trackID: testTrack.Track1,
    speed: 5,
    positionAlongTrack: 0.5,
    size: 10
}

function timeForProjectile(startPos, endPos, projSpeed) {
    return (Math.sqrt(Math.pow(endPos[0] - startPos[0], 2) + Math.pow(endPos[0] - startPos[0], 2))) / projSpeed;
}

function timeForEnemy(startPos, endPos, enemySpeed) {
    return (Math.sqrt(Math.pow(endPos[0] - startPos[0], 2) + Math.pow(endPos[0] - startPos[0], 2))) / enemySpeed;
}

function getPositionsAlongTrack(trackID, initialPos) {
    positions = [];
    for(i = 0; i < trackID.Spline.length - 1; i++) {
        for(k = 0; k < 1; k++) {
            intersections = getPositionsOnSplineSegment(trackID.Spline, initialPos, 0.2)
            for(j = 0; j < intersections.length; j++) {
                closeness = Math.abs(timeForProjectile(initialPos, intersections[j], player.projectileSpeed) - timeForEnemy([0.5, 0.5], intersections[j], enemy.speed))
                if(closeness < enemy.size) {
                    positions.push(intersections[j])
                }
            }
        }
    }
    console.log('these are the positions along the spline')
    console.log(positions)
}

function getPositionsOnSplineSegment(spline, initialPos, distanceFromPos) 
{
    slope = (spline[1][1] - spline[0][1]) / (spline[1][0] - spline[0][0]);
    yint = spline[0][1] - (slope * spline[0][0]);
    x = initialPos[0]
    y = initialPos[1]

    a = 1 + Math.pow(slope, 2);
    b = -x * 2 + (slope * (yint - y)) * 2;
    c = Math.pow(x, 2) + Math.pow(yint - y, 2) - Math.pow(distanceFromPos, 2);

    d = Math.pow(b, 2) - (4 * a * c);

    if(d > 1) 
    {
        foundX = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        if(foundX < Math.max(spline[0][0], spline[1][0]) && foundX > Math.min(spline[0][0], spline[1][0])) 
        {
            return [
                (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
                slope * (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a) + yint
            ]
        }
    }
    else if (d >= 0) 
    {
        foundX1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        foundX2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        
        returnArr = []
        if(foundX1 < Math.max(spline[0][0], spline[1][0]) && foundX1 > Math.min(spline[0][0], spline[1][0])) 
        {   
            returnArr.push([
                foundX1,
                slope * (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a) + yint
            ])
        }
        if(foundX2 < Math.max(spline[0][0], spline[1][0]) && foundX2 > Math.min(spline[0][0], spline[1][0])) 
        {   
            returnArr.push([
                foundX2,
                slope * (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a) + yint
            ])
        }

        return returnArr
    }
    return [];
}

positionsToPreFire = getPositionsAlongTrack(testTrack.Track1, player.position)
console.log(positionsToPreFire)