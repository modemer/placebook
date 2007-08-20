package mwc.facebook.data;

import java.util.Set;

public interface DataStore {
	public User getUserByName(String name);
	public Location getLocationByPoint(Point location);
	public Set<Location> getLocationsWithin(Rectangle area);
	
	public void addUser(User user);
	public void addLocation(Location location);
	
	public void addUserToLocation(User user, Location location);
	public Set<Location> locationsFor(User user);
	public Set<User> usersAssociatedWith(Location location);
}
