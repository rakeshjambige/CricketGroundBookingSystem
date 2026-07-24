package com.vcube.NotificationService.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class User {
	 private int id;
	    private String name;   // optional
	    private String email;  // required
	    private String role; 

}
