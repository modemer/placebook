package mwc.facebook;

import java.sql.SQLException;

import mwc.facebook.data.DataStore;
import mwc.facebook.data.MockDataStore;
import mwc.facebook.data.PostgresDataStore;

/**
 * ObjectManager uses the singleton pattern to provide access to
 * static objects for the lifetime of the server.
 * 
 * At the moment the only object managed is the DataStore.
 * 
 * @author stephen
 *
 */
public class ObjectManager {
	
	public ObjectManager() {
		try {
			store = new PostgresDataStore("localhost:5433", "stalkbook", "facebook", "everybreathyoutake");
		}
		catch (SQLException ex) {
			System.err.println("Error opening SQL Database, using MockDataStore instead.");
			ex.printStackTrace();
			store = new MockDataStore();
		}
	}
	
	public DataStore store() {
		return store;
	}
	
	private DataStore store;
	
	static {
		instance = new ObjectManager();
	}
	
	public static ObjectManager instance() {
		return instance;
	}
	
	private static ObjectManager instance;

}
