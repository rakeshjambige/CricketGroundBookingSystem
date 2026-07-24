package com.vcube.UserAndAuthService.Exception;

public class InvalidPasswordException extends RuntimeException{
	
	public InvalidPasswordException(String message) {
		super(message);
	}

}
