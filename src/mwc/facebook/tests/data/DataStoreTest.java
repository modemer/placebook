package mwc.facebook.tests.data;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.Raster;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.math.MathContext;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Properties;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.imageio.stream.FileImageInputStream;
import javax.imageio.stream.ImageInputStream;

import org.postgresql.core.types.PGDouble;
import org.postgresql.core.types.PGFloat;

import com.facebook.api.PhotoTag;
import com.sun.imageio.plugins.common.ImageUtil;

import junit.framework.Assert;
import junit.framework.TestCase;
import mwc.facebook.ObjectManager;
import mwc.facebook.data.CommentContribution;
import mwc.facebook.data.DataStore;
import mwc.facebook.data.Location;
import mwc.facebook.data.PhotoContribution;
import mwc.facebook.data.Point;
import mwc.facebook.data.Rectangle;
import mwc.facebook.data.TestPGDataStore;
import mwc.facebook.data.User;

public class DataStoreTest extends TestCase {

	private DataStore dataStore;
	
	@Override
	protected void setUp() throws Exception
	{
		dataStore = new TestPGDataStore("localhost:5433", "stalkbook", "facebook", "everybreathyoutake");
	}

	public void testUserNotFound(){
		Assert.assertNull(dataStore.getUserById("######"));
	}

	public void testLocationNotFound(){
		Assert.assertNull(dataStore.getLocationByPoint(new Point(0f, 0f)));
	}

	public void testLocationsWithinZeroArea(){
		Set<Location> temp = dataStore.getLocationsWithin(new Rectangle(new Point(0,0), new Point(0,0)));
		Assert.assertNotNull(temp);
		Assert.assertEquals(0, temp.size());
	}

	public void testAddUser(){
		dataStore.addUser(new User("123", "Bob", "http://some.host/pic.png", new Point(30f,150f)));
		User user = dataStore.getUserById("123");
		Assert.assertNotNull(user);
		Assert.assertNotNull(user.getUser());
		Assert.assertNotNull(user.getName());
		Assert.assertNotNull(user.getHomePoint());
		Assert.assertEquals("123", user.getUser());
		Assert.assertEquals("Bob", user.getName());
		Assert.assertEquals("http://some.host/pic.png", user.getPic());
		Assert.assertEquals(new Point(30f,150f), user.getHomePoint());
	
		user.setHomePoint(new Point(40f, 160f));
		dataStore.updateUser(user);
		
		user = dataStore.getUserById("123");
		Assert.assertEquals(new Point(40f, 160f), user.getHomePoint());
	}
	
	public void testSetDefaultLocation(){
		dataStore.addUser(new User("123", "Bob", "http://some.host/pic.png", new Point(30f,150f)));
		User user = dataStore.getUserById("123");
		user.setHomePoint(new Point(12.4f, 0.234f));
		dataStore.updateUser(user);
		user = dataStore.getUserById("123");
		
		Assert.assertEquals(new Point(12.4f, 0.234f), user.getHomePoint());
	}
	
	public void testAddRemoveLocationToUser() {
		dataStore.addUser(new User("456", "Jim", "http://some.host/pic2.png", new Point(30f,150f)));
		User user = dataStore.getUserById("456");
		Assert.assertNotNull(user);
		Location l1 = new Location(new Point(14.4f, 11.2f), "Location 1");
		dataStore.addLocation(l1);
		dataStore.addUserToLocation(user, l1);
		Set<Location> locations = dataStore.locationsFor(user);

		Assert.assertEquals(1, locations.size());
		Assert.assertEquals(l1, locations.iterator().next());
		
		Set<User> users = dataStore.usersAssociatedWith(l1);
		Assert.assertEquals(1, users.size());
		Assert.assertEquals(user, users.iterator().next());
		
		//test remove
		dataStore.removeUserFromLocation(user, l1);
		locations = dataStore.locationsFor(user);
		
		Assert.assertEquals(0, locations.size());
		
		users = dataStore.usersAssociatedWith(l1);
		Assert.assertEquals(0, users.size());
	}
	
	public void testAddLocation(){
		dataStore.addLocation(new Location(new Point(10.0215986321578945,10.0215986321578945),"Home", "Place where you live"));
		Location location = dataStore.getLocationByPoint(new Point(10.0215986321578945,10.0215986321578945));
		Assert.assertNotNull(location);
		Assert.assertEquals("Home", location.getLocationName());
		Assert.assertEquals("Place where you live", location.getDescription());
		Assert.assertTrue(location.equals(new Location(new Point(10.0215986321578945,10.0215986321578945),"Home", "Place where you live")));
		
		dataStore.addLocation(new Location(new Point(-10000,10000), "Indescribable"));
		location = dataStore.getLocationByPoint(new Point(-10000,10000));
		Assert.assertNotNull(location);
		Assert.assertEquals("Indescribable", location.getLocationName());
		Assert.assertNull(location.getDescription());
	}
	
	
	public void testLocationsWithinArea(){
		Location point1 = new Location(new Point(2,2),"Point 1");
		dataStore.addLocation(point1);
		Location point2 = new Location(new Point(3,5),"Point 2");
		dataStore.addLocation(point2);
		Location point3 = new Location(new Point(6,3),"Point 3");
		dataStore.addLocation(point3);
		
		Set<Location> temp = dataStore.getLocationsWithin(new Rectangle(new Point(0,0), new Point(9,7)));
		Assert.assertNotNull(temp);
		Assert.assertEquals(3, temp.size());
		Assert.assertTrue(temp.contains(point1));
		Assert.assertTrue(temp.contains(point2));
		Assert.assertTrue(temp.contains(point3));

		temp = dataStore.getLocationsWithin(new Rectangle(new Point(1,1), new Point(4,6)));
		Assert.assertNotNull(temp);
		Assert.assertEquals(2, temp.size());
		Assert.assertTrue(temp.contains(point1));
		Assert.assertTrue(temp.contains(point2));
		Assert.assertFalse(temp.contains(point3));

		temp = dataStore.getLocationsWithin(new Rectangle(new Point(3,2), new Point(4,3)));
		Assert.assertNotNull(temp);
		Assert.assertEquals(0, temp.size());

		temp = dataStore.getLocationsWithin(new Rectangle(new Point(4,2), new Point(8,5)));
		Assert.assertNotNull(temp);
		Assert.assertEquals(1, temp.size());
		Assert.assertFalse(temp.contains(point1));
		Assert.assertFalse(temp.contains(point2));
		Assert.assertTrue(temp.contains(point3));

		temp = dataStore.getLocationsWithin(new Point(4,1), 4);
		Assert.assertNotNull(temp);
		Assert.assertEquals(2, temp.size());
		Assert.assertTrue(temp.contains(point1));
		Assert.assertFalse(temp.contains(point2));
		Assert.assertTrue(temp.contains(point3));
	}
	/*
	public void testPhoto() {
			// Add referenced entries
			User u = new User("789", "Kodak", "", new Point(30f,150f));
			dataStore.addUser(u);
			Location l = new Location(new Point(15,15),"Photo probe", "Photo test");
			dataStore.addLocation(l);
			
			// Load and store "pondy"
			byte[] image = null;
			try
			{			
				FileImageInputStream stream = new FileImageInputStream(new File("PeterAndreae.jpg"));
				image = new byte[(int)stream.length()]; 
				stream.readFully(image);
			}
			catch (IOException e)
			{
				e.printStackTrace();
				Assert.fail();
			}
			int id=dataStore.addPhotoTo(u, l, image, "Test photo");
			
			// Check location search
			Set<PhotoContribution> photos = dataStore.getPhotosFrom(l);
			Assert.assertEquals(1, photos.size());
			PhotoContribution p = photos.iterator().next();			
			
			// Check nulls
			Assert.assertNotNull(p);
			Assert.assertNotNull(p.contributedBy);
			Assert.assertNotNull(p.contributedWhen);
			Assert.assertNotNull(p.contributedWhere);
			Assert.assertNotNull(p.image);
			Assert.assertNotNull(p.description);
			
			// Check data
			Assert.assertEquals("Test photo", p.description);
			Assert.assertEquals(u, p.contributedBy);
			Assert.assertEquals(l, p.contributedWhere);
			Assert.assertTrue(Arrays.equals(image, p.image));
			
			// Check user search
			photos = dataStore.getPhotosFrom(u);
			Assert.assertNotNull(photos);
			Assert.assertEquals(1, photos.size());
			p = photos.iterator().next();
			
			// Check nulls
			Assert.assertNotNull(p);
			Assert.assertNotNull(p.contributedBy);
			Assert.assertNotNull(p.contributedWhen);
			Assert.assertNotNull(p.contributedWhere);
			Assert.assertNotNull(p.image);
			Assert.assertNotNull(p.description);
			
			// Check data
			Assert.assertEquals("Test photo", p.description);
			Assert.assertEquals(u, p.contributedBy);
			Assert.assertEquals(l, p.contributedWhere);
			Assert.assertTrue(Arrays.equals(image, p.image));
			
			PhotoContribution photo = dataStore.getPhotoById(id);
			
//			 Check nulls
			Assert.assertNotNull(photo);
			Assert.assertNotNull(photo.contributedBy);
			Assert.assertNotNull(photo.contributedWhen);
			Assert.assertNotNull(photo.contributedWhere);
			Assert.assertNotNull(photo.image);
			Assert.assertNotNull(photo.description);
			
			// Check data
			Assert.assertEquals("Test photo", photo.description);
			Assert.assertEquals(u, photo.contributedBy);
			Assert.assertEquals(l, photo.contributedWhere);
			Assert.assertTrue(Arrays.equals(image, photo.image));	
			
	}*/
	
	public void testComment() {
		// Add referenced entries
		User u = new User("1011", "Commenter", "", new Point(32f,154f));
		dataStore.addUser(u);
		Location l = new Location(new Point(15,15),"Comment monkey", "Why not?");
		dataStore.addLocation(l);
		
		// Test search by location
		dataStore.addCommentTo(u, l, "Chew on this!");
		ArrayList<CommentContribution> comments = dataStore.getCommentsFrom(l);
		
		Assert.assertNotNull(comments);
		Assert.assertEquals(1, comments.size());
		CommentContribution comment = comments.iterator().next();
		
		Assert.assertNotNull(comment.comment);
		Assert.assertNotNull(comment.contributedBy);
		Assert.assertNotNull(comment.contributedWhen);
		Assert.assertNotNull(comment.contributedWhere);
		
		Assert.assertEquals(u, comment.contributedBy);
		Assert.assertEquals(l, comment.contributedWhere);
		Assert.assertEquals("Chew on this!", comment.comment);
		
		// Test search by user
		comments = dataStore.getCommentsFrom(u);

		Assert.assertNotNull(comment.comment);
		Assert.assertNotNull(comment.contributedBy);
		Assert.assertNotNull(comment.contributedWhen);
		Assert.assertNotNull(comment.contributedWhere);

		Assert.assertNotNull(comments);
		Assert.assertEquals(1, comments.size());
		comment = comments.iterator().next();
		Assert.assertEquals(u, comment.contributedBy);
		Assert.assertEquals(l, comment.contributedWhere);
		Assert.assertEquals("Chew on this!", comment.comment);
	}
}
