/**
 * 
 */
package mwc.facebook.data;

import java.util.Date;

import mwc.facebook.JSONable;

/**
 * @author ramsayneil
 *
 */
public class CommentContribution implements JSONable
{
	public String comment;
	public Date contributedWhen;
	public User contributedBy;
	public Location contributedWhere;
	
	public CommentContribution(String comment, Date contributedWhen, User contributedBy, Location contributedWhere)
	{
		this.comment = comment;
		this.contributedWhen = contributedWhen;
		this.contributedBy = contributedBy;
		this.contributedWhere = contributedWhere;
	}

	public String toJSON() {
		StringBuffer sb = new StringBuffer();
		sb.append("{ ");
		sb.append("date: \"" + contributedWhen.toString() + "\", ");
		sb.append("comment: \"" + Location.escapeString(comment) + "\", ");
		sb.append("location: \"" + Location.escapeString(contributedWhere.getLocationName())+"\"");
		sb.append("\"}");
		return sb.toString();
	}
}
